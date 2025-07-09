import { UserDocument } from "../../models/user.model"; // adjust path & type

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument; // or the minimal interface/type with _id
    }
  }
}
