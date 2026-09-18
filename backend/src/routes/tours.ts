import { Router } from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../middleware/auth.js';

export const toursRouter = Router();

// POST /api/tours — schedule a private showing (public)
toursRouter.post('/', async (req, res) => {
  await db.read();
  const { propertyId, propertyTitle, tourType, date, time, name, email, phone, notes } = req.body;

  if (!propertyId || !date || !time || !name || !email) {
    res.status(422).json({ success: false, message: 'Validation failed: property, date, time, name, and email are required.' });
    return;
  }

  const booking = {
    id: `TR-${String(db.data.tourBookings.length + 1).padStart(5, '0')}`,
    propertyId,
    propertyTitle: propertyTitle || 'Selected Property',
    tourType: tourType || 'In-Person',
    date,
    time,
    name,
    email,
    phone: phone || '',
    notes: notes || '',
    status: 'confirmed' as const,
    createdAt: new Date().toISOString(),
  };

  db.data.tourBookings.push(booking);
  await db.write();

  res.status(201).json({
    success: true,
    message: 'Private tour scheduled! Our luxury concierge will confirm your appointment within 2 hours.',
    bookingId: booking.id,
    data: booking,
  });
});

// GET /api/tours (admin only)
toursRouter.get('/', requireAdmin, async (req, res) => {
  await db.read();
  res.json({ success: true, count: db.data.tourBookings.length, data: db.data.tourBookings });
});

// PATCH /api/tours/:id (admin only)
toursRouter.patch('/:id', requireAdmin, async (req, res) => {
  await db.read();
  const booking = db.data.tourBookings.find((t) => t.id === req.params.id);
  if (!booking) {
    res.status(404).json({ success: false, message: 'Tour booking not found.' });
    return;
  }
  if (req.body.status) booking.status = req.body.status;
  if (req.body.notes !== undefined) booking.notes = req.body.notes;
  if (req.body.date) booking.date = req.body.date;
  if (req.body.time) booking.time = req.body.time;

  await db.write();
  res.json({ success: true, message: 'Tour booking updated successfully.', data: booking });
});

// DELETE /api/tours/:id (admin only)
toursRouter.delete('/:id', requireAdmin, async (req, res) => {
  await db.read();
  const index = db.data.tourBookings.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ success: false, message: 'Tour booking not found.' });
    return;
  }
  const removed = db.data.tourBookings.splice(index, 1)[0];
  await db.write();
  res.json({ success: true, message: 'Tour booking deleted.', data: removed });
});
