import { RpcException } from '@nestjs/microservices';

export enum ErrorCode {
  VALIDATION_ERROR = 3,
  NOT_FOUND = 5,
  ALREADY_EXISTS = 6,
  PERMISSION_DENIED = 7,
  UNAUTHENTICATED = 16,
  INTERNAL_ERROR = 13,
}

export class BaseException extends RpcException {
  constructor(
    message: string,
    code: ErrorCode = ErrorCode.INTERNAL_ERROR,
    module: string = 'unknown',
  ) {
    super({
      message,
      code,
      module,
    });
  }
}

// Generic exceptions that can be used across all modules
export class ResourceNotFoundException extends BaseException {
  constructor(resource: string, id: string, module: string) {
    super(`${resource} with ID ${id} not found`, ErrorCode.NOT_FOUND, module);
  }
}

export class ResourceValidationException extends BaseException {
  constructor(message: string, module: string) {
    super(message, ErrorCode.VALIDATION_ERROR, module);
  }
}

export class ResourceAlreadyExistsException extends BaseException {
  constructor(resource: string, identifier: string, module: string) {
    super(`${resource} with ${identifier} already exists`, ErrorCode.ALREADY_EXISTS, module);
  }
}

export class ResourcePermissionDeniedException extends BaseException {
  constructor(message: string, module: string) {
    super(message, ErrorCode.PERMISSION_DENIED, module);
  }
}

export class ResourceUnauthenticatedException extends BaseException {
  constructor(message: string = 'Unauthenticated', module: string) {
    super(message, ErrorCode.UNAUTHENTICATED, module);
  }
}

export class ResourceInternalException extends BaseException {
  constructor(message: string, module: string) {
    super(message, ErrorCode.INTERNAL_ERROR, module);
  }
} 