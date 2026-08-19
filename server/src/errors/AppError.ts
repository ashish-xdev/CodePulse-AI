export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, new.target.prototype); // Restore prototype chain
  }
}