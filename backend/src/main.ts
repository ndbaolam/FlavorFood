import 'reflect-metadata';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as express from 'express';
import cookieParser from 'cookie-parser';
// import './instrumentation'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  
  const config = new DocumentBuilder()
    .setTitle('Flavor Food API')
    .setDescription('The API description')
    .setVersion('1.0')    
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  
  const port = process.env.PORT || 3000;

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.CLIENT_URL || "*", // Replace frontend URL
    credentials: true,
  });

  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`🚀 Open SwaggerUI: http://localhost:${port}/docs`);
  Logger.log(`🚀 Open JaegerUI: http://localhost:16686`);
}

bootstrap();
