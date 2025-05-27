import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User } from './user.entity';
import {
  ResourceNotFoundException,
  ResourceInternalException
} from '../exceptions/base.exception';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private readonly MODULE_NAME = 'user';

  constructor(private databaseService: DatabaseService) {}

  async getUsers(tenantId: string, tenantDbName: string): Promise<User[]> {
    const connection = await this.databaseService.getTenantConnection(tenantId, tenantDbName);
    const userRepository = connection.getRepository(User);
    return userRepository.find();
  }

  async createUser(createUserDto: CreateUserDto, tenantId: string, dbName: string): Promise<User> {
    try {
      this.logger.log('Creating new user', { tenantId, dbName });
      const connection = await this.databaseService.getTenantConnection(tenantId, dbName);
      const userRepository = connection.getRepository(User);
      const user = userRepository.create(createUserDto);
      const savedUser = await userRepository.save(user);
      this.logger.log(`User created successfully with ID: ${savedUser.id}`);
      return savedUser;
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack);
      throw new ResourceInternalException('Failed to create user', this.MODULE_NAME);
    }
  }

  async getUserById(tenantId: string, tenantDbName: string, userId: string): Promise<User | null> {
    const connection = await this.databaseService.getTenantConnection(tenantId, tenantDbName);
    const userRepository = connection.getRepository(User);
    return userRepository.findOne({ where: { id: userId } });
  }

  async getUser(id: string): Promise<User> {
    try {
      this.logger.log(`Fetching user with ID: ${id}`);

      const user = await this.getUserById(null, null, id);
      
      if (!user) {
        throw new ResourceNotFoundException('User', id, this.MODULE_NAME);
      }
      
      this.logger.log(`User found with ID: ${id}`);
      return user;
    } catch (error) {
      this.logger.error(`Error fetching user: ${error.message}`, error.stack);
      if (error instanceof ResourceNotFoundException) {
        throw error;
      }
      // Transform any other error into a ResourceInternalException
      throw new ResourceInternalException(
        `Failed to fetch user: ${error.message}`,
        this.MODULE_NAME
      );
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      this.logger.log(`Updating user with ID: ${id}`);
      const user = await this.getUserById(null, null, id);
      
      if (!user) {
        throw new ResourceNotFoundException('User', id, this.MODULE_NAME);
      }

      const updatedUser = {
        ...user,
        ...updateUserDto,
        updatedAt: new Date(),
      };
      
      const connection = await this.databaseService.getTenantConnection(null, null);
      const userRepository = connection.getRepository(User);
      await userRepository.save(updatedUser);
      this.logger.log(`User updated successfully with ID: ${id}`);
      return updatedUser;
    } catch (error) {
      this.logger.error(`Error updating user: ${error.message}`, error.stack);
      if (error instanceof ResourceNotFoundException) {
        throw error;
      }
      throw new ResourceInternalException('Failed to update user', this.MODULE_NAME);
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      this.logger.log(`Deleting user with ID: ${id}`);
      // const user = await this.getUserById(null, null, id);
      
      // if (!user) {
      //   throw new ResourceNotFoundException('User', id, this.MODULE_NAME);
      // }
      
      // const connection = await this.databaseService.getTenantConnection(null, null);
      // const userRepository = connection.getRepository(User);
      // await userRepository.remove(user);
      // this.logger.log(`User deleted successfully with ID: ${id}`);
    } catch (error) {
      this.logger.error(`Error deleting user: ${error.message}`, error.stack);
      if (error instanceof ResourceNotFoundException) {
        throw error;
      }
      throw new ResourceInternalException('Failed to delete user', this.MODULE_NAME);
    }
  }
} 