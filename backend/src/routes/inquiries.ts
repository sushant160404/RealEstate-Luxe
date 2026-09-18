import { Router } from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../middleware/auth.js';

export const inquiriesRouter = Router();

// POST /api/inquiries — buyer/seller consultation (public)
inquiriesRouter.post('/', async (req, res) => {
  await db.read();
  const { name, email, phone, interestType, preferredLocation, budgetRange, message } = req.body;

  if (!name || !email || !message) {
    res.status(422).json({ success: false, message: 'Validation failed: name, email, and message are required.' });
    return;
  }

  const inquiry = {
    id: `INQ-${String(db.data.inquiries.length + 1).padStart(5, '0')}`,
    name,
    email,
    phone: phone || '',
    interestType: interestType || 'general',
    preferredLocation: preferredLocation || '',
    budgetRange: budgetRange || '',
    message,
    status: 'pending' as const,
    notes: '',
    createdAt: new Date().toISOString(),
  };

  db.data.inquiries.push(inquiry);
  await db.write();

  res.status(201).json({
    success: true,
    message: 'Consultation inquiry received. Priya Sharma will personally connect with you shortly.',
    inquiryId: inquiry.id,
    data: inquiry,
  });
});

// GET /api/inquiries (admin only)
inquiriesRouter.get('/', requireAdmin, async (req, res) => {
  await db.read();
  res.json({ success: true, count: db.data.inquiries.length, data: db.data.inquiries });
});

// PATCH /api/inquiries/:id (admin only)
inquiriesRouter.patch('/:id', requireAdmin, async (req, res) => {
  await db.read();
  const inq = db.data.inquiries.find((i) => i.id === req.params.id);
  if (!inq) {
    res.status(404).json({ success: false, message: 'Inquiry not found.' });
    return;
  }
  if (req.body.status) inq.status = req.body.status;
  if (req.body.notes !== undefined) inq.notes = req.body.notes;

  await db.write();
  res.json({ success: true, message: 'Inquiry updated successfully.', data: inq });
});

// DELETE /api/inquiries/:id (admin only)
inquiriesRouter.delete('/:id', requireAdmin, async (req, res) => {
  await db.read();
  const index = db.data.inquiries.findIndex((i) => i.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ success: false, message: 'Inquiry not found.' });
    return;
  }
  const removed = db.data.inquiries.splice(index, 1)[0];
  await db.write();
  res.json({ success: true, message: 'Inquiry deleted.', data: removed });
});
