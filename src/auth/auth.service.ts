import { Injectable } from '@nestjs/common';
import { CustomError } from 'src/customError/customError';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

type SignInResponse = Omit<User, 'password'>;
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    console.log('in auth service signIn');
    const user = await this.userService.findOne(email);
    if (!user) {
      throw CustomError.authError('User not found');
    }
    const valid = await bcrypt.compare(password, user.password);

    if (user && valid) {
      const { createdAt, email, id, name }: SignInResponse = user;
      const res: SignInResponse = { createdAt, email, id, name };
      return res;
    }
  }

  async validateToken(user: any) {
    const payload = { email: user.email, sub: user.id };
    const currentDate = Date.now();
    const expirationDate = new Date(currentDate + 60 * 60).toLocaleString();
    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '60m',
      }),
      expirationDate: expirationDate,
    };
  }
}
