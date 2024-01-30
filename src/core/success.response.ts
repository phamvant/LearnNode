import { Response } from "express";
import { HttpResponse } from "./http.response/index.status";

class SuccessResponse {
  status: string;
  message: string;
  code: number;
  metadata: Record<string, any>;
  options: Record<string, any>;

  constructor({
    message,
    status = "success",
    code = HttpResponse.Code.OK,
    reasonStatusCode = HttpResponse.Reason.OK,
    metadata = {},
    options = {},
  }: {
    status?: string;
    message?: string;
    code: number;
    reasonStatusCode: string;
    metadata?: Record<string, any>;
    options: Record<string, any>;
  }) {
    this.status = status;
    this.message = message ? message : reasonStatusCode;
    this.code = code;
    this.metadata = metadata;
    this.options = options;
  }

  send = (res: Response) => {
    return res.status(this.code).json(this);
  };
}

export class CREATE extends SuccessResponse {
  constructor({
    message,
    metadata = {},
    options = {},
  }: {
    message: string;
    metadata: Record<string, any> | undefined;
    options?: Record<string, any>;
  }) {
    super({
      message,
      metadata,
      code: HttpResponse.Code.CREATED,
      reasonStatusCode: HttpResponse.Reason.CREATED,
      options,
    });
  }
}

export class ACCEPTED extends SuccessResponse {
  constructor({
    message,
    metadata = {},
    options = {},
  }: {
    message: string;
    metadata: Record<string, any>;
    options?: Record<string, any>;
  }) {
    super({
      message,
      metadata,
      code: HttpResponse.Code.ACCEPTED,
      reasonStatusCode: HttpResponse.Reason.ACCEPTED,
      options,
    });
  }
}

// interface SuccessParams {
//   status?: string;
//   message?: string;
//   code?: number;
//   reason?: string;
//   metadata?: Record<string, any>;
//   options?: Record<string, any>;
// }

// interface SuccessResponseObject {
//   status: string;
//   message: string;
//   code: number;
//   metadata: Record<string, any>;
//   options: any;
// }

// const CreateSuccessResponse = ({
//   status = "success",
//   message,
//   code = HttpResponse.Code.OK,
//   reason = HttpResponse.Reason.OK,
//   metadata = {},
//   options = {},
// }: SuccessParams): SuccessResponseObject => ({
//   status: status,
//   code: code,
//   message: message || reason,
//   metadata: metadata,
//   options: options || {},
// });

// export const CREATE = ({
//   message,
//   metadata,
// }: {
//   message?: string;
//   metadata?: Record<string, any>;
// }) => {
//   return CreateSuccessResponse({
//     message,
//     metadata,
//     code: HttpResponse.Code.CREATED,
//     reason: HttpResponse.Reason.CREATED,
//   });
// };

// export const SendRespone = (
//   res: Response,
//   ResponseData: SuccessResponseObject
// ) => {
//   return res.status(ResponseData.code).json(ResponseData);
// };
