import { Request, Response, NextFunction } from "express";
import CustomeError from "./customError";

export interface ErrorObject {
  success: boolean;
  statusCode: number;
  message: string;
}

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  const errorResponse: ErrorObject = {
    success: false,
    statusCode,
    message,
  };

  res.status(statusCode).json(errorResponse);
}

export function throwError(statusCode: number, message: string) {
  const error = new CustomeError(message, statusCode);
  (error.message = message), (error.statusCode = statusCode);

  return error;
}
