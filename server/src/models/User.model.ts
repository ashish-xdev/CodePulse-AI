import { Schema, model } from "mongoose";
import type { HydratedDocument } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
}

export type UserDocument = HydratedDocument<IUser>;

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    const { passwordHash, ...user } = ret;
    return user;
  },
});

export const User = model<IUser>("User", userSchema);