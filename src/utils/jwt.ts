import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { TJwtPayload } from "../modules/auth/auth.interface.js";

const createToken = (
  payload:TJwtPayload,
  secret: string,
  expiresIn: SignOptions["expiresIn"]
) => {
  return jwt.sign(payload, secret, { expiresIn });
};

const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};

export const jwtUtils = {
  createToken,
  verifyToken,
};