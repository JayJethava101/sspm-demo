import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { User } from '../user/user.entity';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private tenantConnections = new Map<string, DataSource>();

  constructor(private configService: ConfigService) {}

  async getTenantConnection(tenantId: string, tenantDbName: string): Promise<DataSource> {
    // Check if connection already exists
    if (this.tenantConnections.has(tenantId)) {
      const connection = this.tenantConnections.get(tenantId);
      if (connection.isInitialized) {
        return connection;
      }
    }

    // Create new connection
    const connection = new DataSource({
      type: 'postgres',
      name: `tenant_${tenantId}`,
      host: this.configService.get('PG_HOST', 'localhost'),
      port: this.configService.get('PG_PORT', 5432),
      username: this.configService.get('PG_USER', 'postgres'),
      password: this.configService.get('PG_PASSWORD', '1234'),
      database: tenantDbName,
      entities: [User], // Add other entities as needed
      synchronize: true,
    });

    try {
      await connection.initialize();
      this.tenantConnections.set(tenantId, connection);
      this.logger.log(`Created new database connection for tenant ${tenantId}`);
      return connection;
    } catch (error) {
      this.logger.error(`Failed to create database connection for tenant ${tenantId}`, error);
      throw error;
    }
  }

  async onModuleDestroy() {
    // Close all tenant connections when the module is destroyed
    for (const [tenantId, connection] of this.tenantConnections.entries()) {
      if (connection.isInitialized) {
        await connection.destroy();
        this.logger.log(`Closed database connection for tenant ${tenantId}`);
      }
    }
    this.tenantConnections.clear();
  }
} 