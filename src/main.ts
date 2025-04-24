import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './common/config';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  logger.log('Starting application...');
  logger.log(`Environment: ${envs.NODE_ENV}`);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(
    morgan('combined', {
      stream: { write: (message) => logger.log(message.trim()) },
    }),
  );

  await app.listen(envs.PORT);
  console.log(`Server is running on http://${envs.HOST}:${envs.PORT}`);
  logger.log(`Server is running on http://${envs.HOST}:${envs.PORT}`);
  logger.log(`Application started successfully`);
}
bootstrap();
