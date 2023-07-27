import { Request, Response } from 'express';
import User from '../models/user.model';
import { sendResponse } from '../utils/responseHelper';
import { AuthenticatedRequest } from '../interface/AuthenticatedRequest';
import { IUser } from '../interface/IUser';

export const myProfile = async (req: AuthenticatedRequest , res: Response): Promise<void> => { 
  try{
    const user: IUser | null = await User.findById(req.user?.userId);
    if (!user) {
      return sendResponse(res, false, 'User not found', undefined, 404);
    }
    user.password = "";
    sendResponse(res, true, 'Profile retrieved successfully', user);
  }catch(error){
    console.error('Error fetching user:', error);
    sendResponse(res, false, 'An error occurred while fetching user', undefined, 500);
  }
}