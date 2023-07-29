import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../const/config';
import { AuthenticatedRequest,DecodedToken } from '../interface/AuthenticatedRequest';
import { sendResponse } from '../utils/responseHelper';


export const authorizedUser = (req:AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization');

  if (!token) {
    sendResponse(res, false, 'Unauthorized Access! Empty Token', undefined, 401);
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as DecodedToken;
    req.user = decoded; // Save the user ID in the request object for further use
    next();
  } catch (error) {
    sendResponse(res, false, 'Unauthorized Access! Invalid Token', undefined, 401);
    return;
  }
};
