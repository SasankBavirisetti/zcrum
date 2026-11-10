import 'dotenv/config';
import postgres from '@prisma/orm-postgres/runtime';
import { contractFromJson } from '@prisma/orm-postgres/static';
import { normalizeDatabaseUrl } from '../lib/database-url.js';
import contractJson from './schema.json' with { type: 'json' };

/** @type {import('./schema').Contract} */
export const contract = contractFromJson(contractJson);

export const db = postgres({
  contract,
  url: normalizeDatabaseUrl(process.env['DATABASE_URL']),
});
