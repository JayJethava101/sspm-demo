import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { BaseException } from '../exceptions/base.exception';

@Catch(RpcException)
export class GrpcExceptionFilter implements RpcExceptionFilter<RpcException> {
  private readonly logger = new Logger(GrpcExceptionFilter.name);

  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    console.log('Flow come to grpc exception filetr')
    const error = exception.getError() as any;
    const module = error.module || 'unknown';

    
    this.logger.error(
      `[${module}] Exception: ${error.message}`,
      exception.stack,
    );

    // Handle validation errors
    if (error.code === 3) { // Validation error code
      const validationErrors = JSON.parse(error.message);
        return throwError(() => ({
          status: 'error',
          code: error.code,
          details: JSON.stringify({
            message: 'Validation failed',
            errors: validationErrors,
            module: module,
            timestamp: new Date().toISOString(),
          }),
        }));
    }

    return throwError(() => ({
      status: 'error',
      code: error.code || 13,
      // message: error.message,
      // module: module,
      // timestamp: new Date().toISOString(),
      details: JSON.stringify({
        message: error.message,
        module: module,
        timestamp: new Date().toISOString(),
      })
    }));
  }
} 