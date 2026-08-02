import mongoose, { Schema, Document } from "mongoose";
import {type IUser} from "../types/user.type.js";


const UserSchema: Schema<IUser> = new Schema(
  {
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    avatar: { type: String, default: "" },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
