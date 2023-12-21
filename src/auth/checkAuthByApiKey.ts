import { NextFunction, Request, Response } from "express";
import { Permission } from "..";
import ApiKeyService from "../services/apikey.service";

interface ReqWithApiKey extends Request {
  objKey?: any;
}

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

export const checkByApiKey = async (
  req: ReqWithApiKey,
  res: Response,
  next: NextFunction
) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(401).json({
        messsage: "Forbidden error",
      });
    }

    const objKey = await ApiKeyService.findById(key);

    if (!objKey) {
      return res.status(401).json({
        messsage: "Forbidden error",
      });
    }

    console.log("objKey : ", objKey);
    req.objKey = objKey;
    return next();
  } catch (error) {}
};

export const permissionCheck = (permission: Permission) => {
  return (req: ReqWithApiKey, res: Response, next: NextFunction) => {
    if (!req.objKey.permission) {
      return res.status(403).json({
        message: "Permission denined",
      });
    }

    console.log("Permission:", req.objKey.permission);

    const validPermission = req.objKey.permission.includes(permission);

    if (!validPermission) {
      return res.status(403).json({
        message: "Permission denined",
      });
    }

    return next();
  };
};
