import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { signToken } from "../utils/jwt.js";
import type { IUser } from "../types/user.type.js";

export interface IRegisterInput {
  username: string;
  name: string;
  email: string;
  password: string;
}

export interface ILoginInput {
  email: string;
  password: string;
}

const sanitizeUser = (user: IUser) => {
  const userObject = user.toObject ? user.toObject() : user;
  const { password, ...safeUser } = userObject as IUser & { password?: string };

  return safeUser;
};

export class AuthService {
  async register(input: IRegisterInput) {
    const existingUser = await User.findOne({
      $or: [{ email: input.email }, { username: input.username }],
    });

    if (existingUser) {
      throw new Error("A user with that email or username already exists.");
    }

    const hashedPassword = await bcrypt.hash(input.password, 12);

    const user = await User.create({
      username: input.username,
      name: input.name,
      email: input.email,
      password: hashedPassword,
    });

    const token = signToken(user._id.toString());

    return {
      token,
      user: sanitizeUser(user),
    };
  }

  async login(input: ILoginInput) {
    const user = await User.findOne({ email: input.email });

    if (!user) {
      throw new Error("Invalid email or password.");
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password.");
    }

    const token = signToken(user._id.toString());

    return {
      token,
      user: sanitizeUser(user),
    };
  }

  async getCurrentUser(userId: string) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    return {
      user: sanitizeUser(user),
    };
  }
}

export const authService = new AuthService();
