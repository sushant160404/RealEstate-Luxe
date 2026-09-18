import 'dotenv/config';
import path from 'node:path';

function requireInProd(value: string | undefined, name: string, devFallback: string): string {
  if (value && value.trim() !== '') return value;
  if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line no-console
    console.warn(
      `[config] WARNING: ${name} is not set. Using an insecure development fallback. ` +
        `Set ${name} in your environment before running in production.`
    );
  }
  return devFallback;
}

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 4000,
  dataDir: path.resolve(process.cwd(), process.env.DATA_DIR || './data'),
  frontendUrls: (process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  jwtSecret: requireInProd(process.env.JWT_SECRET, 'JWT_SECRET', 'dev-only-insecure-secret'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  adminSeed: {
    name: process.env.ADMIN_NAME || 'Priya Sharma',
    email: (process.env.ADMIN_EMAIL || 'admin@luxeliving.in').toLowerCase().trim(),
    password: process.env.ADMIN_PASSWORD || 'luxe2026',
  },
};
