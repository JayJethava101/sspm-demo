import { Controller, Get, Post, Put, Delete, Body, Param, Headers } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User } from 'src/interfaces/user.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Headers('x-tenant-id') tenantId: string
  ): Promise<User> {
    if (!tenantId) {
      throw new Error('tenantId key is required in header');
    }
    return this.userService.createUser(createUserDto, tenantId);
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<User> {
    return this.userService.getUser(id);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.userService.deleteUser(id);
  }
} 