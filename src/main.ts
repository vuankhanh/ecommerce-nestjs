import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bull';
import { getQueueToken } from '@nestjs/bull';
import { handleBullQueueError } from './shared/util/bull-error-handler';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const staticPath = configService.get('folder.uploads');

  // Lấy queue (ví dụ: mail)
  const mailQueue = app.get<Queue>(getQueueToken('mail'));

  mailQueue.on('error', handleBullQueueError);

  app.enableCors();
  app.setGlobalPrefix('api');
  app.useStaticAssets(staticPath, {
    prefix: '/static/',
  });

  const port = AppModule.port || 3004;
  console.log(`App is running on port ${port}`);
  await app.listen(port);
}
bootstrap();
