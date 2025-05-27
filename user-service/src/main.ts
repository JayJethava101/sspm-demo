import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { join } from 'path';
import { GrpcExceptionFilter } from './filters/grpc-exception.filter';
import { Logger } from '@nestjs/common';
import { CustomValidationPipe } from './pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'user',
        protoPath: join(__dirname, 'proto/user.proto'),
        url: 'localhost:5000',
      },
    },
  );

  const logger = new Logger('Bootstrap');
  
  // Use custom validation pipe
  app.useGlobalPipes(new CustomValidationPipe());
  
  app.useGlobalFilters(new GrpcExceptionFilter());
  
  await app.listen();
  logger.log('User Service is running on port 5000');
}
bootstrap(); 