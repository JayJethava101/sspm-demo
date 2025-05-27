import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class AppService {
  private users = [];
  private idCounter = 1;

  createUser(data: { name: string; email: string }) {
    const user = {
      id: this.idCounter++,
      name: data.name,
      email: data.email,
    };
    this.users.push(user);
    return user;
  }

  getUser(data: { id: number }) {
    const user = this.users.find(user => user.id === data.id);
    if (!user) {
      throw new NotFoundException(`User with ID ${data.id} not found`);
    }
    return user;
  }
} 