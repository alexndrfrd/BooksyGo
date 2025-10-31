import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], // Frontend URLs
    credentials: true,
  });

  // Enable global validation pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip properties that do not have decorators
    forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are provided
    transform: true, // Transform payloads to DTO instances
  }));

  // Set global prefix for all routes
  app.setGlobalPrefix('api');

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('BooksyGo User Service API')
    .setDescription('API pentru autentificare, gestionare utilizatori și profile în platforma BooksyGo')
    .setVersion('1.0')
    .addTag('auth', 'Autentificare și înregistrare')
    .addTag('users', 'Gestionare utilizatori')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Introdu JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'BooksyGo API Docs',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`🚀 User Service running on: http://localhost:${port}/api`);
  console.log(`📚 Swagger Documentation: http://localhost:${port}/api/docs`);
}
bootstrap();
