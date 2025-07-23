import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import * as dotenv from 'dotenv';
dotenv.config(); //  Loads .env into process.env

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    // 👇 Use raw body parser for Stripe Webhook (must come before all global pipes/middleware)
  app.use('/webhook', express.raw({ type: 'application/json' }));

  app.enableCors({
    origin: '*', // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow credentials
  });

  app.useGlobalPipes(new ValidationPipe({
    transform: true, // Automatically transform payloads to DTO instances
    whitelist: true, // Strip properties that do not have any decorators
  }));

  // Set the port from environment variable or default to 3000
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
