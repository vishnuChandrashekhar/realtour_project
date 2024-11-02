import { JwtPayload } from "jsonwebtoken";
import * as express from "express";
import { UserSchema } from "../Models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
