import bcrypt from 'bcryptjs';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { db } from '../db.js';
import { requireAdmin, signAdminToken } from '../middleware/auth.js';
import { formatINRPrice } from '../utils/format.js';

export const adminRouter = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Please try again in a few minutes.' },
});

// POST /api/admin/login
adminRouter.post('/login', loginLimiter, async (req, res) => {
  await db.read();
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    return;
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const account = db.data.admins.find((a) => a.email.toLowerCase() === normalizedEmail);

  const passwordOk = account ? await bcrypt.compare(password, account.passwordHash) : false;
  if (!account || !passwordOk) {
    res.status(401).json({ success: false, message: 'Invalid executive credentials. Please check your email and password.' });
    return;
  }

  account.lastLogin = new Date().toISOString();
  await db.write();

  const token = signAdminToken({ sub: account.id, email: account.email, name: account.name, role: account.role });
  const { passwordHash: _omit, ...safeUser } = account;

  res.json({ success: true, message: `Welcome back, ${account.name}! Executive session authorized.`, token, user: safeUser });
});

// POST /api/admin/logout
adminRouter.post('/logout', (_req, res) => {
  // JWTs are stateless; the client discards the token. Nothing to invalidate server-side.
  res.json({ success: true, message: 'Successfully logged out of the LuxeLiving Admin Console.' });
});

// GET /api/admin/me
adminRouter.get('/me', requireAdmin, async (req, res) => {
  await db.read();
  const account = db.data.admins.find((a) => a.id === req.admin?.sub);
  if (!account) {
    res.status(401).json({ success: false, message: 'No active authenticated session.' });
    return;
  }
  const { passwordHash: _omit, ...safeUser } = account;
  res.json({ success: true, user: safeUser });
});

// GET /api/admin/stats (admin only)
adminRouter.get('/stats', requireAdmin, async (req, res) => {
  await db.read();
  const { properties, inquiries, tourBookings, newsletter } = db.data;

  const totalInventoryValue = properties.reduce((acc, p) => acc + (p.status !== 'For Rent' ? p.price : 0), 0);
  const activeListings = properties.filter((p) => p.status !== 'Sold').length;
  const pendingInquiries = inquiries.filter((i) => i.status === 'pending').length;
  const upcomingTours = tourBookings.filter((t) => t.status === 'confirmed').length;

  res.json({
    success: true,
    data: {
      totalListings: properties.length,
      activeListings,
      totalInventoryValue,
      formattedInventoryValue: formatINRPrice(totalInventoryValue),
      totalTours: tourBookings.length,
      upcomingTours,
      totalInquiries: inquiries.length,
      pendingInquiries,
      subscribersCount: newsletter.length,
      recentActivity: [
        ...tourBookings.slice(-3).map((t) => ({ type: 'tour', text: `Showing booked for ${t.propertyTitle} by ${t.name}`, date: t.createdAt })),
        ...inquiries.slice(-3).map((i) => ({ type: 'inquiry', text: `New consultation lead from ${i.name} (${i.preferredLocation || 'India'})`, date: i.createdAt })),
      ]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 6),
    },
  });
});
