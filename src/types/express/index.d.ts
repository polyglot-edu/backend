import { UserDocument } from "../../models/user.model";

declare global {
  namespace Express {
    export interface Request {
      user?: UserDocument;
      /** How the request authenticated. Set by checkAuth. */
      authMethod?: "google" | "apikey" | "test";
    }
  }
}
