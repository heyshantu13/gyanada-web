import { Request } from 'express';

export interface DecodedToken {
  userId: string;
  fullname: string;
  iat: number; // Issued At timestamp
  exp: number; // Expiry timestamp
}

// Extend the Request interface with the custom 'user' property
export interface AuthenticatedRequest extends Request {
  user?: DecodedToken;
}
