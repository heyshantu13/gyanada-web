import { AuthenticatedRequest } from "../interface/AuthenticatedRequest";
import { Response } from 'express';
import { sendResponse } from "../utils/responseHelper";

export const uploadProfile =  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
   sendResponse(res,true,'photo uploaded succesfully',{fileName:req.file?.fieldname},200)
}