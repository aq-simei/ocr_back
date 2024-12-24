import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma, User } from '@prisma/client';
import { SafeUser } from 'src/@types/User';

export type CreateUserDto = Prisma.UserCreateInput & {
  confirmPassword: string;
};

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('new')
  async createUser(@Body() data: CreateUserDto): Promise<SafeUser> {
    return this.userService.createUser(data);
  }

  @Post('update')
  async updateUser(@Body() data: Prisma.UserUpdateInput): Promise<SafeUser> {
    return this.userService.updateUser(data);
  }

  @Get('all')
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }
}
