import { Document, Schema, model } from "mongoose";

export interface UserSchema extends Document {
  username: string;
  email: string;
  password: string;
  avatar: string;
}

const userSchema = new Schema<UserSchema>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
  },
  {
    timestamps: true,
  }
);

const User = model<UserSchema>("User", userSchema);

export default User;
