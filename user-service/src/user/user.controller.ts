import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User } from './user.entity';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'CreateUser')
  async createUser(createUserDto: CreateUserDto, metadata: Record<string, any>) {
    const tenantId = metadata.internalRepr.get('tenant-id')?.[0];
    const dbName = metadata.internalRepr.get('db-name')?.[0];

    if (!tenantId || !dbName) {
      throw new RpcException('Tenant ID and database name are required');
    }

    return this.userService.createUser(createUserDto, tenantId, dbName);
  }

  @GrpcMethod('UserService', 'GetUser')
  async getUser({ id }: { id: string }): Promise<User> {
    return this.userService.getUser(id);
  }

  @GrpcMethod('UserService', 'UpdateUser')
  async updateUser(data: { id: string } & UpdateUserDto): Promise<User> {
    const { id, ...updateUserDto } = data;
    return this.userService.updateUser(id, updateUserDto);
  }

  @GrpcMethod('UserService', 'DeleteUser')
  async deleteUser({ id }: { id: string }): Promise<void> {
    return this.userService.deleteUser(id);
  }
} 