import { Router } from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../middleware/auth.js';

export const newsletterRouter = Router();

// POST /api/newsletter (public)
newsletterRouter.post('/', async (req, res) => {
  await db.read();
  const { email } = req.body;
  if (!email || !String(email).includes('@')) {
    res.status(422).json({ success: false, message: 'Please provide a valid email address.' });
    return;
  }

  const normalized = String(email).toLowerCase().trim();
  if (!db.data.newsletter.includes(normalized)) {
    db.data.newsletter.push(normalized);
    await db.write();
  }

  res.json({
    success: true,
    message: 'You have been subscribed to exclusive off-market listings and architectural previews!',
    email: normalized,
  });
});

// GET /api/newsletter (admin only)
newsletterRouter.get('/', requireAdmin, async (req, res) => {
  await db.read();
  res.json({ success: true, count: db.data.newsletter.length, data: db.data.newsletter });
});

// DELETE /api/newsletter/:email (admin only)
newsletterRouter.delete('/:email', requireAdmin, async (req, res) => {
  await db.read();
  const target = decodeURIComponent(req.params.email).toLowerCase().trim();
  const index = db.data.newsletter.findIndex((e) => e === target);
  if (index === -1) {
    res.status(404).json({ success: false, message: 'Subscriber not found.' });
    return;
  }
  const removed = db.data.newsletter.splice(index, 1)[0];
  await db.write();
  res.json({ success: true, message: 'Subscriber removed.', email: removed });
});
