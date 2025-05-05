import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantModule } from './tenant/tenant.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';



@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // Central management database connection
    TypeOrmModule.forRoot({
      name: 'management',
      type: 'postgres',
      host: process.env.PG_HOST || 'localhost',
      port: 5432,
      username: process.env.PG_USER || 'postgres',
      password: process.env.PG_PASSWORD || 'postgres',
      database: process.env.PG_MANAGEMENT_DB || 'saas_management',
      entities: [__dirname + '/tenant/entities/*.entity.{js,ts}'],
      synchronize: true, // Set to false in production
    }),
    
    TenantModule,
    
    DatabaseModule,
    
    UsersModule,
    
   
  ],
})
export class AppModule {}
