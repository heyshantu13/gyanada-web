import { Response } from 'express';

export const sendSuccessResponse = (res: Response, data: any, message: string , status: number = 200) => {
  return res.status(status).json({ success: true, data, message });
};

export const sendErrorResponse = (res: Response, message: string = 'Error', status: number = 500) => {
  return res.status(status).json({ success: false, message });
};
