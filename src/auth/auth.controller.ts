import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  BadRequestException,
  UnauthorizedException,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() req, @Res() res: Response) {
    if (!req.email || !req.password) {
      throw new BadRequestException('Email and password must be provided');
    }
    const signInResponse = await this.authService.signIn(
      req.email,
      req.password,
    );
    if (!signInResponse) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Invalid email or password',
      });
    }
    return res.status(HttpStatus.OK).json({
      token: signInResponse.token,
      sessionToken: signInResponse.sessionToken,
      user: signInResponse.user,
    });
  }

  @Post('refresh-token')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res() res: Response,
  ) {
    try {
      const sessionTokens =
        await this.authService.refreshSessionToken(refreshTokenDto);
      return res.status(HttpStatus.OK).json({ sessionTokens });
    } catch (error) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: error.message });
    }
  }
}
