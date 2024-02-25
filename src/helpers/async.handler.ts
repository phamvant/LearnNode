import { NextFunction, Response } from "express";
import { CustomRequest } from "../auth/auth.utils";

export const asyncHandler = (
  fn: (req: CustomRequest, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
