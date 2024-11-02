// Rotehandler for user - /api/user

import { NextFunction, Request, Response } from "express";
import { throwError } from "../utils/error.handler";
import bcrypt from "bcrypt";
import User, { UserSchema } from "../Models/user.model";
import Listing from "../Models/listing.model";

export const updateUserInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user)
    return next(throwError(401, "Unauthorized access: User not authenticated"));

  if (req.user?.id !== req.params.id)
    return next(throwError(401, "You can only update your own account"));

  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    ).lean(); // .lean() converts the result into a plain javascript object

    if (!updatedUser) res.status(401).json({ message: "User not found" });

    const { password, ...rest } = updatedUser as UserSchema;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.id !== req.params.id)
    return next(throwError(401, "You can only delete your own account"));

  try {
    const userDeleteAcoount = await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token", { path: "/" });
    res.status(200).json({ message: "User has been deleted" });
  } catch (error) {
    next(error);
  }
};

export const getUserListing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.id !== req.params.id) {
    return next(throwError(401, `You can only view your own listings`));
  } else {
    try {
      const listing = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listing);
    } catch (error) {
      next(error);
    }
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(throwError(404, "User not found"));

    const { password: pass, ...rest } = user.toJSON();
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
