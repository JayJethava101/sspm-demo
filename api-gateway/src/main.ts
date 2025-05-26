import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  
  app.useGlobalFilters(new GlobalExceptionFilter());
  
  await app.listen(3000);
  logger.log('API Gateway is running on port 3000');
}
bootstrap(); 