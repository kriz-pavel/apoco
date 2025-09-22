import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let errorDetails: { status: number; error: string; message: string };

    if (exception instanceof HttpException) {
      const exResponse = exception.getResponse();
      if (typeof exResponse === 'string') {
        errorDetails = {
          status: exception.getStatus(),
          error: exception.name,
          message: exResponse,
        };
      } else {
        errorDetails = { ...exResponse, status: exception.getStatus() } as {
          status: number;
          error: string;
          message: string;
        };
      }
    } else if (exception instanceof ServiceUnavailableException) {
      errorDetails = {
        status: HttpStatus.SERVICE_UNAVAILABLE,
        error: 'Service unavailable',
        message: 'Service unavailable',
      };
    } else {
      if (process.env.NODE_ENV === 'development') {
        errorDetails = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: (exception as Error)?.name || 'Error',
          message: (exception as Error)?.message || 'Unknown error',
        };
      } else {
        errorDetails = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Internal server error',
          message: 'Internal server error',
        };
      }
    }

    const errorResponse = {
      statusCode: errorDetails.status,
      message: errorDetails.message,
      error: errorDetails.error,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(errorDetails.status).json(errorResponse);
  }
}
