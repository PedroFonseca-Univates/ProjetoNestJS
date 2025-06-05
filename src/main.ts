import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { Log } from 'wa-log';

Log.setConsolePrint(true);
Log.setLevel(0, 3);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.enableCors();

  await app.listen(3000);

  Log.info('INFO', 'Aplicação rodando na porta 3000');
}
bootstrap();