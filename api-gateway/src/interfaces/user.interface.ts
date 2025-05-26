import { CreateUserDto, UpdateUserDto } from "src/user/dto/user.dto";

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserService {
  createUser(createUserDto: CreateUserDto): Promise<User>;
  getUser(data: { id: string }): Promise<User>;
  updateUser(data: { id: string } & UpdateUserDto): Promise<User>;
  deleteUser(data: { id: string }): Promise<void>;
}
