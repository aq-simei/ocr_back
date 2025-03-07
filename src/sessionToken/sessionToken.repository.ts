import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { randomUUID } from 'node:crypto';

@Injectable()
export class SessionTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createSessionToken(userId: string): Promise<string> {
    const sessionToken = await this.prisma.sessionToken.create({
      data: {
        userId,
        token: this.generateToken(),
        expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
    });
    return sessionToken.token;
  }

  async findSessionToken(token: string) {
    const sessionToken = await this.prisma.sessionToken.findFirst({
      where: { token },
    });
    return sessionToken;
  }

  async updateSessionToken(token: string, id: string): Promise<string> {
    const newToken = this.generateToken();
    await this.prisma.sessionToken.update({
      where: { token, userId: id },
      data: { token: newToken },
    });
    return newToken;
  }

  private generateToken(): string {
    return randomUUID();
  }
}
