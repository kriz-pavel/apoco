import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Response } from 'express';
import { ConfigurationService } from './config';

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

  app.useLogger(app.get(Logger));

  // --- OpenAPI / Swagger ---
  const config = new DocumentBuilder()
    .setTitle('Pokédex API')
    .setDescription(
      'REST API for exploring the Pokémon catalog and storing favorite Pokémon.',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.getHttpAdapter().get('/openapi.json', (_, res: Response) => {
    res.json(document);
  });

  const configService = app.get<ConfigurationService>(ConfigurationService);
  const port = configService.port;
  await app.listen(port);

  const base = `http://localhost:${port}`;

  console.log('\n===========================================');
  console.log(`Swagger UI:     ${base}/docs`);
  console.log(`OpenAPI JSON:   ${base}/openapi.json`);
  console.log('===========================================\n');
}
void bootstrap();
