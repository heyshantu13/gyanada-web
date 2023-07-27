import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../const/config';
import { AuthenticatedRequest,DecodedToken } from '../interface/AuthenticatedRequest';


export const authorizedUser = (req:AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization');

  if (!token) {
    res.status(401).json({ message: 'Unauthorized. No token provided.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as DecodedToken;
    req.user = decoded; // Save the user ID in the request object for further use
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized. Invalid token.' });
    return;
  }
};
