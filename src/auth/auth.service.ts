import { Injectable } from '@nestjs/common';
import { CustomError } from 'src/customError/customError';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { SessionTokenRepository } from 'src/sessionToken/sessionToken.repository';
import { RefreshTokenDto } from './dto/refresh-token.dto';

type SignInUserResponse = {
  user: {
    id: string;
    name: string;
    email: string;
  };
};

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
    private readonly sessionTokenRepository: SessionTokenRepository,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.userService.findOne(email);
    if (!user) {
      CustomError.authError('User not found');
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return CustomError.authCredentialError('Invalid password', 401);
    }

    const { id, name } = user;

    const res: SignInUserResponse = {
      user: { id, name, email },
    };
    // Generate JWT token
    const payload = { email, sub: id };
    const jwtToken = this.jwtService.sign(payload);

    const sessionToken = await this.createSessionToken(id);
    return { ...res, token: jwtToken, sessionToken };
  }

  async createSessionToken(userId: string): Promise<string> {
    return this.sessionTokenRepository.createSessionToken(userId);
  }

  async refreshSessionToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ newSessionToken: string; jwtToken: string }> {
    const { sessionToken } = refreshTokenDto;
    const session =
      await this.sessionTokenRepository.findSessionToken(sessionToken);

    if (!session) {
      throw new Error('Invalid refresh token || could not find');
    }

    const newSessionToken =
      await this.sessionTokenRepository.updateSessionToken(session.token, session.userId);

    // return new jwt as well
    const payload = { email: session.userId, sub: session.userId };
    const jwtToken = this.jwtService.sign(payload);

    return { newSessionToken, jwtToken };
  }
}
