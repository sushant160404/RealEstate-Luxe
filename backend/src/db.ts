import fs from 'node:fs';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { config } from './config.js';
import type { DbSchema } from './types.js';
import {
  INITIAL_AGENT,
  INITIAL_INQUIRIES,
  INITIAL_NEWSLETTER,
  INITIAL_PROPERTIES,
  INITIAL_TOUR_BOOKINGS,
  INITIAL_WHATSAPP_CAMPAIGNS,
  WHATSAPP_TEMPLATES,
} from './seedData.js';

function defaultData(): DbSchema {
  return {
    properties: INITIAL_PROPERTIES,
    tourBookings: INITIAL_TOUR_BOOKINGS,
    inquiries: INITIAL_INQUIRIES,
    newsletter: INITIAL_NEWSLETTER,
    agent: INITIAL_AGENT,
    admins: [
      {
        id: 'adm-01',
        name: config.adminSeed.name,
        email: config.adminSeed.email,
        role: 'Managing Principal & Superadmin',
        passwordHash: bcrypt.hashSync(config.adminSeed.password, 10),
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        lastLogin: new Date().toISOString(),
      },
    ],
    whatsappTemplates: WHATSAPP_TEMPLATES,
    whatsappCampaigns: INITIAL_WHATSAPP_CAMPAIGNS,
  };
}

fs.mkdirSync(config.dataDir, { recursive: true });
const dbFilePath = path.join(config.dataDir, 'db.json');

const adapter = new JSONFile<DbSchema>(dbFilePath);
export const db = new Low<DbSchema>(adapter, defaultData());

export async function initDb() {
  await db.read();
  if (!db.data) {
    db.data = defaultData();
    await db.write();
    // eslint-disable-next-line no-console
    console.log(`[db] Initialized new data store at ${dbFilePath}`);
  } else {
    // Merge in any new default fields (e.g. after an upgrade) without clobbering existing data.
    const fresh = defaultData();
    db.data.properties ??= fresh.properties;
    db.data.tourBookings ??= fresh.tourBookings;
    db.data.inquiries ??= fresh.inquiries;
    db.data.newsletter ??= fresh.newsletter;
    db.data.agent ??= fresh.agent;
    db.data.admins ??= fresh.admins;
    db.data.whatsappTemplates ??= fresh.whatsappTemplates;
    db.data.whatsappCampaigns ??= fresh.whatsappCampaigns;
    await db.write();
    // eslint-disable-next-line no-console
    console.log(`[db] Loaded existing data store from ${dbFilePath}`);
  }
}
