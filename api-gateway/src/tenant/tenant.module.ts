import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';
import { Tenant } from './entities/tenant.entity';
// import { DatabaseModule } from '../database/database.module';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { KmsService } from 'src/services/kms.service';
const databaseConfig = (configService: ConfigService): DataSourceOptions => ({
  type: 'postgres',
  name: 'central_db',
  host: configService.get<string>('PG_HOST', 'localhost'),
  port: configService.get<number>('PG_PORT', 5432),
  username: configService.get<string>('PG_USER', 'postgres'),
  password: configService.get<string>('PG_PASSWORD', '1234'),
  database: configService.get<string>('PG_MANAGEMENT_DB', 'sspm_central_db'),
  entities: [Tenant],
  synchronize: true,
});

@Module({
  imports: [
    ConfigModule,
     // Central management database connection
    TypeOrmModule.forRootAsync({
      name: 'central_db',
      imports: [ConfigModule],
      useFactory: databaseConfig,
      inject: [ConfigService],
      // This tells NestJS to inject the ConfigService into your factory function. 
      // Your databaseConfig function probably receives ConfigService as a parameter 
      // to read configuration values.
    }),
    TypeOrmModule.forFeature([Tenant], 'central_db'), // The second parameter 'central_db' specifying that this entity belongs to that specific database connection.
    // DatabaseModule,
  ],
  controllers: [TenantController],
  providers: [
    TenantService,
    // KmsService,
  ],
  exports: [TenantService],
})
export class TenantModule {}