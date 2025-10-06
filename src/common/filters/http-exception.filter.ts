import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  Inject,
  Optional,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigurationService } from '../../config';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: Logger = new Logger(HttpExceptionFilter.name),
    @Optional()
    @Inject(ConfigurationService)
    private readonly configService?: ConfigurationService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let errorDetails: { status: number; error: string; message: string[] };

    if (exception instanceof HttpException) {
      const exResponse = exception.getResponse();
      if (typeof exResponse === 'string') {
        errorDetails = {
          status: exception.getStatus(),
          error: exception.name,
          message: [exResponse],
        };
      } else {
        errorDetails = {
          status: exception.getStatus(),
          error: exception.name,
          message: getErrorMessage(
            (exResponse as { message: string })?.message,
          ) || ['Unknown error'],
        };
      }
    } else {
      if (this.configService?.isDevelopment) {
        errorDetails = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: (exception as Error)?.name || 'Error',
          message: getErrorMessage((exception as Error)?.message) || [
            'Unknown error',
          ],
        };
      } else {
        errorDetails = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Internal server error',
          message: ['Internal server error'],
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

    this.logger.error(
      `[${request.method}] ${request.url} - ${errorDetails.status} - ${errorDetails.error} - ${errorDetails.message.join(', ')}, Original error: ${exception as Error}`,
    );

    response.status(errorDetails.status).json(errorResponse);
  }
}

function getErrorMessage(message: string | string[]): string[] {
  if (Array.isArray(message)) {
    return message;
  }
  return [message];
}
