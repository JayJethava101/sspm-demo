import { Injectable, Inject, Logger, NotFoundException } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Tenant } from '../tenant/entities/tenant.entity';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);
  private tenantConnections = new Map<string, DataSource>();

  constructor(
    @InjectRepository(Tenant, 'management')
    private tenantRepository: Repository<Tenant>,
    private configService: ConfigService,
    @Inject('DATA_SOURCE')
    private defaultDataSource: DataSource,
  ) {}

  async getConnectionForTenant(tenantId: string): Promise<DataSource> {
    // Check if connection exists in cache
    if (this.tenantConnections.has(tenantId)) {
      const connection = this.tenantConnections.get(tenantId);
      
      // Check if connection exists and reinitialize if not connected
      if (connection && !connection.isInitialized) {
        await connection.initialize();
      }
      
      // Return connection with proper type checking
      if (connection) {
        return connection;
      }
    }

    // Get tenant details from management DB
    const tenant = await this.tenantRepository.findOneBy({ id: tenantId });
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${tenantId} not found`);
    }

    // Create connection options
    const options: DataSourceOptions = {
      type: 'postgres',
      host: tenant.dbHost,
      port: tenant.dbPort,
      username: tenant.dbUser,
      password: tenant.dbPassword,
      database: tenant.dbName,
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      // Exclude the Tenant entity
      entitySkipConstructor: true,
    };

    // Create and initialize connection
    const connection = new DataSource(options);
    await connection.initialize();
    
    // Cache the connection
    this.tenantConnections.set(tenantId, connection);
    
    return connection;
  }

  async closeAllConnections(): Promise<void> {
    for (const [tenantId, connection] of this.tenantConnections.entries()) {
      if (connection.isInitialized) {
        await connection.destroy();
        this.logger.log(`Closed connection for tenant ${tenantId}`);
      }
    }
    this.tenantConnections.clear();
  }
}