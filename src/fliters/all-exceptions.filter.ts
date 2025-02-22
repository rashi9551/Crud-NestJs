import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    console.error('🚨 Exception Caught:', exception);
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Something went wrong';

    // Handle HTTP Exceptions (e.g., Bad Request, Unauthorized, Forbidden, Not Found)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();

      // Handle class-validator validation errors
      if (typeof errorResponse === 'object' && (errorResponse as any).message) {
        message = (errorResponse as any).message;
      } else {
        message = exception.message;
      }
    }

    // Handle MongoDB Duplicate Key Error (Code 11000)
    if ((exception as any)?.code === 11000) {
      status = HttpStatus.CONFLICT; // 409 Conflict
      message = 'Email already exists';
    }

    // Handle Mongoose Validation Errors
    if ((exception as any)?.name === 'ValidationError') {
      status = HttpStatus.BAD_REQUEST;
      message = Object.values((exception as any).errors)
        .map((err: any) => err.message)
        .join(', ');
    }

    // Handle Database Connection Errors
    if ((exception as any)?.name === 'MongoNetworkError') {
      status = HttpStatus.SERVICE_UNAVAILABLE;
      message = 'Database connection error';
    }

    // Handle Unauthorized Errors
    if (exception instanceof UnauthorizedException) {
      status = HttpStatus.UNAUTHORIZED;
      message = 'Unauthorized access';
    }

    // Handle Forbidden Errors
    if (exception instanceof ForbiddenException) {
      status = HttpStatus.FORBIDDEN;
      message = 'Access denied';
    }

    // Handle Not Found Errors
    if (exception instanceof NotFoundException) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message ?? 'Resource not found'; // ✅ Uses the actual error message
    }

    if ((exception as any)?.name === 'CastError' && (exception as any)?.kind === 'ObjectId') {
      status = HttpStatus.BAD_REQUEST;
      message = `Invalid ID format: ${(exception as any).value}`;
    }

    // Send the final error response
    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
