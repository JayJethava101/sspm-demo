import { Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User, IUserService } from 'src/interfaces/user.interface';


@Injectable()
export class UserService {
  private userService: IUserService;

  constructor(@Inject('USER_PACKAGE') private client: ClientGrpc) {
    this.userService = this.client.getService('UserService');
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
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