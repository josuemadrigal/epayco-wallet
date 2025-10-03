import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { EmailService } from './email/email.service';

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

  // Verificar conexión de email
  const emailService = app.get(EmailService);
  await emailService.verifyConnection();

  await app.listen(3001);
  console.log('🚀 DB Service running on http://localhost:3001');
}
bootstrap();
