import { Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User, IUserService } from 'src/interfaces/user.interface';
import { Metadata } from '@grpc/grpc-js';
import { TenantService } from '../tenant/tenant.service';

@Injectable()
export class UserService {
  private userService: IUserService;

  constructor(
    @Inject('USER_PACKAGE') private client: ClientGrpc,
    private tenantService: TenantService
  ) {
    this.userService = this.client.getService('UserService');
  }

  async createUser(createUserDto: CreateUserDto, tenantId: string): Promise<User> {
    const tenant = await this.tenantService.findById(tenantId);
    if (!tenant) {
      throw new Error('Tenant not found');
    }

    const metadata = new Metadata();
    metadata.add('tenant-id', tenantId);
    metadata.add('db-name', tenant.dbName);
    return this.userService.createUser(createUserDto, metadata);
  }

  async getUser(id: string): Promise<User> {
    return this.userService.getUser({ id });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.updateUser({ id, ...updateUserDto });
  }

  async deleteUser(id: string): Promise<void> {
    return this.userService.deleteUser({ id });
  }
} 