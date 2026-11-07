import 'dotenv/config';
import postgres from '@prisma/orm-postgres/runtime';
import { contractFromJson } from '@prisma/orm-postgres/static';
// import type { Contract } from './contract.d';
import contractJson from './schema.json' with { type: 'json' };

export const contract = contractFromJson(contractJson);

export const db = postgres({
  contract,
  url: process.env['DATABASE_URL'],
});

