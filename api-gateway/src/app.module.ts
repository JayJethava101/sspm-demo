import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantModule } from './tenant/tenant.module';

console.log({
  name: 'central_db',
  type: 'postgres',
  host: process.env.PG_HOST || 'localhost',
  port: 5432,
  username: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || '1234',
  database: process.env.PG_MANAGEMENT_DB || 'sspm_central_db',
  entities: [__dirname + '/tenant/entities/*.entity.{js,ts}'],
  synchronize: true, // todo: Set to false in production
})

@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
    }),

     // Central management database connection
     TypeOrmModule.forRoot({
      name: 'central_db',
      type: 'postgres',
      host: process.env.PG_HOST || 'localhost',
      port: 5432,
      username: process.env.PG_USER || 'postgres',
      password: process.env.PG_PASSWORD || '1234',
      database: process.env.PG_MANAGEMENT_DB || 'sspm_central_db',
      entities: [__dirname + '/tenant/entities/*.entity.{js,ts}'],
      synchronize: true, // todo: Set to false in production
    }),

    TenantModule,
    
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {} 