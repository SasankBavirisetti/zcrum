import 'dotenv/config';
import { definePrismaConfig } from '@prisma/cli-engine';
import { defineConfig as ormConfig } from '@prisma/orm-postgres/config';
import { normalizeDatabaseUrl } from './lib/database-url.js';

export default definePrismaConfig({
  orm: ormConfig({
    contract: "./prisma/schema.prisma",
    db: {
      connection: normalizeDatabaseUrl(process.env['DATABASE_URL'])!,
    },
  }),
});
