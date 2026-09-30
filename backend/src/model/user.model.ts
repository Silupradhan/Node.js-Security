import { HydratedDocument, Model, Schema, model } from "mongoose";

export type UserRole = "user" | "admin";

export interface User {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export type UserDocument = HydratedDocument<User>;

const userSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    }
  },
  {
    timestamps: true
  }
);

const UserModel: Model<User> = model<User>("User", userSchema);

export default UserModel;
