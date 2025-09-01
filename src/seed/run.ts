import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeedService } from './seed.service';

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });
  const seeder = app.get(SeedService);
  await seeder.run();
  await app.close();
  console.log('Seed Seeding completed.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
