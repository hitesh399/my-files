import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import type { ApiResponse, ApiErrorResponse } from '../contracts';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'INTERNAL_SERVER_ERROR';
    let details: any = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;

      // Handle validation errors
      if (status === HttpStatus.BAD_REQUEST && exceptionResponse.message) {
        if (Array.isArray(exceptionResponse.message)) {
          // class-validator errors
          message = 'Validation failed';
          details = exceptionResponse.message.map((msg: string) => ({
            field: msg.split(' ')[0],
            message: msg,
          }));
        } else {
          message = exceptionResponse.message;
        }
      } else {
        message = exceptionResponse.message || exception.message;
      }

      error = exceptionResponse.error || exception.name;
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
    }

    const errorResponse: ApiErrorResponse = {
      success: false,
      statusCode: status,
      message,
      error,
      ...(details && { details }),
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(errorResponse);
  }
}
