import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SeedManager } from '@mikro-orm/seeder';
import * as dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  clientUrl: process.env.DATABASE_URL,
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  metadataProvider: TsMorphMetadataProvider,
  migrations: {
    // path: 'dist/migrations',
    pathTs: 'src/migrations',
  },
  seeder: {
    path: './src/seeders',
    defaultSeeder: 'MainSeeder',
  },
  extensions: [SeedManager],
});
