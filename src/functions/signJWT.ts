import jwt from "jsonwebtoken";
import { IUser } from "../interfaces/User.interface";
import { HTMLError } from "../util/errorHandler";

export const signJWT = (user: IUser) => {
  let token: string | null;
  try {
    token = jwt.sign(
      {
        email: user.email,
        id: user._id,
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRY || "24h" }
    );
  } catch (error) {
    throw new HTMLError("Failed to create token", 500);
  }
  return token;
};
