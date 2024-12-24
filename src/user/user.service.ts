import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { CustomError } from 'src/customError/customError';
import { SafeUser } from 'src/@types/User';
import { CreateUserDto } from './user.controller';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUserDto): Promise<SafeUser> {
    const plainPassword = data.password;
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    return this.prisma.user.create({
      data: { ...data, password: hashedPassword },
    });
  }
  async updateUser(data: Prisma.UserUpdateInput): Promise<SafeUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: data.id as string },
    });
    if (!user) {
      throw new CustomError('User', 'User not found');
    }
    const res = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        ...data,
        id: user.id,
        password: data.password
          ? await bcrypt.hash(data.password as string, 10)
          : user.password,
      },
    });
    const safeRes: SafeUser = {
      name: res.name,
      email: res.email,
      id: res.id,
      createdAt: res.createdAt,
    };
    return safeRes;
  }
  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(email: string): Promise<User | null> {
    console.log('in findOne for email -> ', email);
    return this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }
}
