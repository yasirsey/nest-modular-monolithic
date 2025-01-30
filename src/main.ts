import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable CORS before other configurations
  app.enableCors({
    origin: true, // Reflects the request origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Global pipes
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle(configService.get<string>('app.name', 'API Documentation'))
    .setDescription(configService.get<string>('app.description', 'The API description'))
    .setVersion(configService.get<string>('app.version', '1.0'))
    .addBearerAuth()
    .addTag('Authentication', 'Authentication endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Admin', 'Administrator endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: configService.get<string>('app.name', 'API Documentation')
  });

  // CORS configuration
  const corsEnabled = configService.get<boolean>('cors.enabled', false);
  if (corsEnabled) {
    const corsOptions = {
      origin: configService.get<string | string[]>('cors.origin', '*'),
      methods: configService.get<string[]>('cors.methods', ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
      credentials: configService.get<boolean>('cors.credentials', true),
    };
    app.enableCors(corsOptions);
  }

  // Start server
  const port = configService.get<number>('app.port', 5000);
  const host = configService.get<string>('app.host', '0.0.0.0');

  await app.listen(port, host);
  console.log(`Application ${configService.get<string>('app.name')} is running on: ${await app.getUrl()}`);
  console.log(`Swagger Documentation is available at: ${await app.getUrl()}/api`);
}

bootstrap();
