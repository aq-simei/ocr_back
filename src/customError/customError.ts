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

  static authError(message: string) {
    return new CustomError('Auth', message);
  }

  static userError(message: string) {
    return new CustomError('User', message);
  }
}
