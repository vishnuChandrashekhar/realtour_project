import { NextFunction, Request, Response } from "express";
import User, { UserSchema } from "../Models/user.model";
import bcryptjs from "bcrypt";
import { throwError } from "../utils/error.handler";
import jwt from "jsonwebtoken";
import config from "config";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password } = req.body;
  const salt = config.get("salt_work_factor") as string;

  const hashedPassword = bcryptjs.hashSync(password, parseInt(salt));

  const newUser: UserSchema = new User({
    username,
    email,
    password: hashedPassword,
  });

  // Save the new user in database
  try {
    await newUser.save();
    res.status(201).json("User Created successfully");
  } catch (error: any) {
    next(error);
  }
};

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    const validUser: UserSchema | null = await User.findOne({ email: email });

    if (!validUser) {
      return next(throwError(404, "User Not Found"));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) {
      return next(throwError(401, "Invalid Password"));
    }

    // create token for sessions

    const jwt_key = config.get("jwt_key") as string;
    const token = jwt.sign({ id: validUser._id }, jwt_key);

    const { password: _, ...rest } = validUser.toObject();

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const googleAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email: string = req.body.email;
  const name: string = req.body.name.toString();
  const avatar: string = req.body.photo;
  const username: string =
    name.replace(/\s+/g, "").toLowerCase() +
    Math.random().toString(36).slice(-4);

  try {
    const user: UserSchema | null = await User.findOne({ email });

    if (user) {
      const jwt_key: string = config.get("jwt_key") as string;
      const token = jwt.sign({ id: user._id }, jwt_key);

      const { password: _, ...rest } = user.toObject();

      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatePassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatePassword, 10);

      const newUser: UserSchema = new User({
        username,
        email,
        password: hashedPassword,
        avatar,
      });
      await newUser.save(); // Save the new user in the database
      const jwt_key: string = config.get("jwt_key") as string;

      const token = jwt.sign({ id: newUser._id }, jwt_key);

      const { password: _, ...rest } = newUser.toObject();

      res
        .cookie("access_token", token, { httpOnly: true })
        .status(201)
        .json(rest);
    }
  } catch (error: any) {
    next(error); // Pass the error to the next middleware
  }
};

export const signout = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out");
  } catch (error) {
    next(error);
  }
};
