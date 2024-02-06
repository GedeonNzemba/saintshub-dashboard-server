import { Request as ExpressRequest } from "express";

declare global {
  namespace Express {
    interface Request extends ExpressRequest {
      userId?: string;
    }
  }
}

// declare namespace Express {
//   export interface Request {
//     userId?: string;
//   }
// }
