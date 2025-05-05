import { Module, Global } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { DatabaseService } from './database.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from 'src/tenant/entities/tenant.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Tenant], 'management'),
  ],
  providers: [...databaseProviders, DatabaseService],
  exports: [...databaseProviders, DatabaseService],
})
export class DatabaseModule {}