import { Router } from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../middleware/auth.js';
import { cleanIndianPhoneNumber, parseCsv } from '../utils/format.js';
import type { WhatsAppRecipient, WhatsAppCampaign } from '../types.js';

export const whatsappRouter = Router();

whatsappRouter.use(requireAdmin);

// GET /api/admin/whatsapp/templates
whatsappRouter.get('/templates', async (req, res) => {
  await db.read();
  res.json({ success: true, data: db.data.whatsappTemplates });
});

// GET /api/admin/whatsapp/campaigns
whatsappRouter.get('/campaigns', async (req, res) => {
  await db.read();
  res.json({ success: true, data: db.data.whatsappCampaigns });
});

// GET /api/admin/whatsapp/campaigns/:id
whatsappRouter.get('/campaigns/:id', async (req, res) => {
  await db.read();
  const campaign = db.data.whatsappCampaigns.find((c) => c.id === req.params.id);
  if (!campaign) {
    res.status(404).json({ success: false, message: 'Campaign not found.' });
    return;
  }
  res.json({ success: true, data: campaign });
});

// POST /api/admin/whatsapp/parse-csv
whatsappRouter.post('/parse-csv', (req, res) => {
  const { csvText } = req.body;
  if (!csvText || typeof csvText !== 'string') {
    res.status(400).json({ success: false, message: 'Invalid or empty CSV content provided.' });
    return;
  }

  const rows = parseCsv(csvText);
  if (rows.length === 0) {
    res.status(400).json({ success: false, message: 'CSV file contains no readable rows.' });
    return;
  }

  const recipients: WhatsAppRecipient[] = [];
  rows.forEach(({ rawName, rawPhone, rawCity, rawBudget, rawInterest }, i) => {
    if (!rawPhone && !rawName) return;
    const phoneValidation = cleanIndianPhoneNumber(rawPhone);
    const cleanDigits = phoneValidation.clean.replace(/\D/g, '');

    recipients.push({
      id: `rec-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
      name: rawName || 'Valued Client',
      phone: rawPhone,
      cleanPhone: phoneValidation.clean,
      city: rawCity,
      budget: rawBudget,
      propertyInterest: rawInterest,
      status: phoneValidation.isValid ? 'valid' : 'invalid',
      validationError: phoneValidation.error,
      dispatchStatus: 'pending',
      waLink: phoneValidation.isValid ? `https://wa.me/${cleanDigits}` : undefined,
    });
  });

  const validCount = recipients.filter((r) => r.status === 'valid').length;
  const invalidCount = recipients.filter((r) => r.status === 'invalid').length;

  res.json({
    success: true,
    data: { recipients, summary: { total: recipients.length, valid: validCount, invalid: invalidCount } },
  });
});

// POST /api/admin/whatsapp/campaigns
whatsappRouter.post('/campaigns', async (req, res) => {
  await db.read();
  const { title, templateId, message, attachedPropertyId, attachedPropertyTitle, attachedPropertyPrice, recipients = [] } = req.body;

  if (!title || !message) {
    res.status(400).json({ success: false, message: 'Campaign title and WhatsApp message body are required.' });
    return;
  }
  if (!Array.isArray(recipients) || recipients.length === 0) {
    res.status(400).json({ success: false, message: 'Please provide at least one recipient.' });
    return;
  }

  const validCount = recipients.filter((r: any) => r.status === 'valid').length;

  const newCampaign: WhatsAppCampaign = {
    id: `camp-${Date.now()}`,
    title: String(title).trim(),
    templateId,
    message,
    attachedPropertyId,
    attachedPropertyTitle,
    attachedPropertyPrice,
    totalRecipients: recipients.length,
    validRecipients: validCount,
    sentCount: 0,
    failedCount: 0,
    status: 'draft',
    createdAt: new Date().toISOString(),
    recipients: recipients.map((r: any) => ({ ...r, dispatchStatus: 'pending' })),
  };

  db.data.whatsappCampaigns.unshift(newCampaign);
  await db.write();

  res.status(201).json({ success: true, message: 'WhatsApp broadcast campaign created successfully.', data: newCampaign });
});

// POST /api/admin/whatsapp/campaigns/:id/broadcast
whatsappRouter.post('/campaigns/:id/broadcast', async (req, res) => {
  await db.read();
  const campaign = db.data.whatsappCampaigns.find((c) => c.id === req.params.id);
  if (!campaign) {
    res.status(404).json({ success: false, message: 'Campaign not found.' });
    return;
  }

  let sent = 0;
  let failed = 0;
  const now = new Date().toISOString();

  campaign.recipients = campaign.recipients.map((r) => {
    if (r.status === 'valid') {
      sent++;
      return { ...r, dispatchStatus: 'sent' as const, sentAt: now };
    }
    failed++;
    return { ...r, dispatchStatus: 'failed' as const, error: r.validationError || 'Invalid phone format' };
  });

  campaign.sentCount = sent;
  campaign.failedCount = failed;
  campaign.status = 'completed';
  campaign.completedAt = now;
  campaign.deliveryRate = campaign.totalRecipients > 0 ? Number(((sent / campaign.totalRecipients) * 100).toFixed(1)) : 0;

  await db.write();

  res.json({ success: true, message: `Broadcast completed. ${sent} messages delivered, ${failed} failed.`, data: campaign });
});

// DELETE /api/admin/whatsapp/campaigns/:id
whatsappRouter.delete('/campaigns/:id', async (req, res) => {
  await db.read();
  const idx = db.data.whatsappCampaigns.findIndex((c) => c.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ success: false, message: 'Campaign not found.' });
    return;
  }
  const removed = db.data.whatsappCampaigns.splice(idx, 1)[0];
  await db.write();
  res.json({ success: true, message: 'Campaign deleted successfully.', data: removed });
});
