import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
  
    // Check if it's an RPC exception by looking at the error structure
    const error = exception.getError?.() || exception;
    if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
      const error = exception.getError?.() || exception;
      console.log('CODE: ', error.code)
      console.log('details: ', error.details)
      // Handle validation errors
      if (error.code === 3) { // Validation error code
        const details = JSON.parse(error.details)
        return response.status(HttpStatus.BAD_REQUEST).json({
          status: 'error',
          ...details,
        // ...(process.env.NODE_ENV === 'development' && { stack: exception.stack })
        stack: error.stack 
        });
      }
  
      // Handle other RPC errors
      const status = this.getHttpStatus(error.code);
      try{
        const details = JSON.parse(error.details)
        return response.status(status).json({
          status: 'error',
          // // message: error.message,
          // message: error.details,
          // module: error.module,
          // timestamp: new Date().toISOString(),
          ...details,
          // ...(process.env.NODE_ENV === 'development' && { stack: exception.stack })
          stack: error.stack 
        });
      }catch{
        return response.status(status).json({
          status: 'error',
          // // message: error.message,
          message: error.details,
          module: 'unknown',
          timestamp: new Date().toISOString(),
          // ...(process.env.NODE_ENV === 'development' && { stack: exception.stack })
          stack: error.stack 
        });
      }
    }

    // HttpExceptions
  }

  private getHttpStatus(code: number): number {
    switch (code) {
      case 3: // Validation error
        return HttpStatus.BAD_REQUEST;
      case 5: // Not found
        return HttpStatus.NOT_FOUND;
      case 7: // Permission denied
        return HttpStatus.FORBIDDEN;
      case 16: // Unauthenticated
        return HttpStatus.UNAUTHORIZED;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
} 