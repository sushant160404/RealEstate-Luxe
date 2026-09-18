import { Router } from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../middleware/auth.js';

export const agentRouter = Router();

// GET /api/agent (public)
agentRouter.get('/', async (req, res) => {
  await db.read();
  res.json({ success: true, data: db.data.agent });
});

// PUT /api/agent (admin only)
agentRouter.put('/', requireAdmin, async (req, res) => {
  await db.read();
  Object.assign(db.data.agent, req.body);
  await db.write();
  res.json({ success: true, message: 'Agent advisor profile updated successfully.', data: db.data.agent });
});
