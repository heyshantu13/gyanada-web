import { Response } from 'express';
import { IApiResponse } from './responseFormat';

export const sendResponse = (
  res: Response,
  success: boolean,
  message: string,
  data?: any,
  code: number = 200
): void => {
  const responseData: IApiResponse = {
    success,
    message,
    code,
  };

  if (data) {
    responseData.data = data;
  }
  res.status(code).json(responseData);
};
