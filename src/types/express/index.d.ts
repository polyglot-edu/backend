import { UserDocument } from "../../models/user.model";

declare global {
  namespace Express {
    export interface Request {
      user?: UserDocument;
      auth: {[x : string] : any} | undefined;
    }
  }
}
