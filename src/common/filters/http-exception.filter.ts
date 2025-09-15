import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status: number =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorDetails: { error: string; message: string };

    if (exception instanceof HttpException) {
      const exResponse = exception.getResponse();
      if (typeof exResponse === 'string') {
        errorDetails = { error: exception.name, message: exResponse };
      } else {
        errorDetails = exResponse as { error: string; message: string };
      }
    } else {
      // rozdíl mezi DEV a PROD
      if (process.env.NODE_ENV === 'development') {
        errorDetails = {
          error: (exception as Error)?.name || 'Error',
          message: (exception as Error)?.message || 'Unknown error',
        };
      } else {
        errorDetails = {
          error: 'Internal server error',
          message: 'Internal server error',
        };
      }
    }

    const errorResponse = {
      statusCode: status,
      message: errorDetails.message,
      error: errorDetails.error,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }
}
