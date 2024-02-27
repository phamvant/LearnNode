import { HttpResponse } from "./http.response/index.status";

interface CommonErrorResponse {
  code?: number;
  message: string;
  details?: string;
}

export class ErrorResponse extends Error {
  code: number;
  details: string;

  constructor({
    code = HttpResponse.Code.BAD_REQUEST,
    message,
    details = "",
  }: CommonErrorResponse) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

export class ConflictRequestError extends ErrorResponse {
  constructor({
    message = HttpResponse.Reason.CONFLICT,
    code = HttpResponse.Code.CONFLICT,
    details = "",
  }) {
    super({ code, message, details });
  }
}

export class BadRequestError extends ErrorResponse {
  constructor({
    message = HttpResponse.Reason.BAD_REQUEST,
    code = HttpResponse.Code.BAD_REQUEST,
    details = "",
  }) {
    super({ code, message, details });
  }
}

export class ForbiddenError extends ErrorResponse {
  constructor({
    message = HttpResponse.Reason.FORBIDDEN,
    code = HttpResponse.Code.FORBIDDEN,
    details = "",
  }) {
    super({ code, message, details });
  }
}

export class AuthFailureError extends ErrorResponse {
  constructor({
    message = HttpResponse.Reason.UNAUTHORIZED,
    code = HttpResponse.Code.UNAUTHORIZED,
    details = "",
  }) {
    super({ code, message, details });
  }
}

export class NotFoundError extends ErrorResponse {
  constructor({
    message = HttpResponse.Reason.NOT_FOUND,
    code = HttpResponse.Code.NOT_FOUND,
    details = "",
  }) {
    super({ code, message, details });
  }
}

export class ServerUnavailableError extends ErrorResponse {
  constructor({
    message = HttpResponse.Reason.SERVICE_UNAVAILABLE,
    code = HttpResponse.Code.SERVICE_UNAVAILABLE,
    details = "",
  }) {
    super({ code, message, details });
  }
}
