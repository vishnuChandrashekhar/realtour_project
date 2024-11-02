import { NextFunction, Request, Response } from "express";
import { throwError } from "./error.handler";
import Jwt from "jsonwebtoken";
import config from "config";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token;

  if (!token) {
    return next(throwError(401, "Unauthorized"));
  }

  const JWT_SECRET = config.get("jwt_key") as string;

  Jwt.verify(token, JWT_SECRET, (error: any, user: any) => {
    if (error) return next(throwError(403, "Forbidden"));

    req.user = user;
    next();
  });
};
