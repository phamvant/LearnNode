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
