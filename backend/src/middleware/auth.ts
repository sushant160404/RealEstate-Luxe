import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export interface AdminTokenPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      admin?: AdminTokenPayload;
    }
  }
}

export function signAdminToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn as any });
}

function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) return authHeader.substring(7);
  if (typeof req.query.token === 'string') return req.query.token;
  if (req.body?.token) return req.body.token;
  return null;
}

/** Requires a valid admin JWT. Rejects the request with 401 if missing/invalid. */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) {
    res.status(401).json({ success: false, message: 'Authentication required. Please sign in to the admin console.' });
    return;
  }
  try {
    const payload = jwt.verify(token, config.jwtSecret) as AdminTokenPayload;
    req.admin = payload;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Your session has expired. Please sign in again.' });
  }
}

/** Attaches req.admin if a valid token is present, but does not block the request otherwise. */
export function optionalAdmin(req: Request, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (token) {
    try {
      req.admin = jwt.verify(token, config.jwtSecret) as AdminTokenPayload;
    } catch {
      // ignore invalid/expired token for optional auth
    }
  }
  next();
}
