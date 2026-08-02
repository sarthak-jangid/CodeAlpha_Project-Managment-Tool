import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ?? "7d") as NonNullable<
  SignOptions["expiresIn"]
>;

export interface IJwtPayload extends JwtPayload {
  userId: string;
}

const ensureJwtSecret = (): string => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return JWT_SECRET;
};

export const signToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    ensureJwtSecret(),
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );
};

export const verifyToken = (token: string): IJwtPayload => {
  const decoded = jwt.verify(token, ensureJwtSecret());

  if (typeof decoded === "string") {
    throw new Error("Invalid token.");
  }

  return decoded as IJwtPayload;
};