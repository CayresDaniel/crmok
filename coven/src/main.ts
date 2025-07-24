import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Configurar validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Prefixo global para APIs
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3009;
  await app.listen(port);
  console.log(`🦇 CovenSO Backend rodando na porta ${port}`);

  // Verificação diária de aniversários será implementada via endpoint
  console.log(
    '📅 Para verificação automática de aniversários, chame: POST /api/reminders/birthdays/check-daily',
  );
}
bootstrap();
