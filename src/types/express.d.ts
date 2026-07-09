import { TJwtPayload } from "../modules/auth/auth.interface.js";

declare global {
  namespace Express {
    interface Request {
      user: TJwtPayload;
    }
  }
}

export {};