import { NextFunction, Request, Response } from "express";
import { toCamel } from "../utils";

export const camelRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body = toCamel(req.body);
  return next();
};
