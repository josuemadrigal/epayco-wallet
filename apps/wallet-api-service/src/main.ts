import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors();

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('ecoWallet API')
    .setDescription('API REST para sistema de billetera virtual')
    .setVersion('1.0')
    .addTag('clients', 'Operaciones de clientes y billetera')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
  console.log('🚀 API Service running on http://localhost:3000');
  console.log('📚 API Docs available at http://localhost:3000/api/docs');
}
bootstrap();
