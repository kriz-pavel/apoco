import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  // --- OpenAPI / Swagger ---
  const config = new DocumentBuilder()
    .setTitle('Pokédex API')
    .setDescription(
      'REST API pro procházení katalogu Pokémonů a ukládání oblíbených.',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'bearer',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);
  // surový JSON (přímý export specifikace)
  app.getHttpAdapter().get('/openapi.json', (req, res) => res.json(document));

  const port = process.env.PORT || 3000;
  await app.listen(port);

  const base = `http://localhost:${port}`;
  // viditelné po `docker compose up`
  // (v Compose si můžeš přemapovat na host)
  // ať je to nepřehlédnutelné:
  // eslint-disable-next-line no-console
  console.log('\n===========================================');
  console.log(`API:            ${base}/api`);
  console.log(`Swagger UI:     ${base}/docs`);
  console.log(`OpenAPI JSON:   ${base}/openapi.json`);
  console.log('===========================================\n');
}
void bootstrap();
