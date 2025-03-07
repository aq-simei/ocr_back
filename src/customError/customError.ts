import { BadRequestException, UnauthorizedException } from '@nestjs/common';

export class CustomError extends Error {
  constructor(
    public context: string,
    public message: string,
    public errorCode: number = 400,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.context = context;
    this.errorCode = errorCode;
  }

  static authCredentialError(message: string, errorCode: number) {
    throw new UnauthorizedException(message);
  }

  static authError(message: string) {
    throw new BadRequestException(message);
  }

  static userError(message: string) {
    return new CustomError('User', message);
  }
}
