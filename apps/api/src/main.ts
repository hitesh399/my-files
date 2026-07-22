import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cors, { type CorsOptionsDelegate } from 'cors';
import type { Request } from 'express';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for credentialed cookie-based auth.
  const defaultAllowedOrigins = [
    'http://localhost:5173',
    'http://localhost:4173',
  ];
  const isProduction = process.env.NODE_ENV === 'production';
  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
    : defaultAllowedOrigins;

  const corsOptionsDelegate: CorsOptionsDelegate<Request> = (
    request,
    callback,
  ) => {
    const requestOrigin = request.header('Origin');

    if (!isProduction) {
      callback(null, {
        origin: true,
        credentials: true,
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      });
      return;
    }

    if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
      callback(null, {
        origin: true,
        credentials: true,
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      });
      return;
    }

    callback(new Error(`CORS blocked for origin: ${requestOrigin}`));
  };

  app.use(cors(corsOptionsDelegate));

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global exception filter
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Auth API')
    .setDescription('Authentication API for user login and token management')
    .setVersion('1.0.0')
    .addTag('Auth', 'Authentication endpoints')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  console.log(`Auth API running on port ${process.env.PORT ?? 3000}`);
}
bootstrap();
