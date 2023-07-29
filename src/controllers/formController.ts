import { Request, Response } from 'express';
import Form from '../models/form.model';
import { sendResponse } from '../utils/responseHelper';
import { AuthenticatedRequest } from '../interface/AuthenticatedRequest';
import { IForm } from '../interface/IForm';

export const storeForm = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { display,components } = req.body;
  const formData = {
    display: display,
    components: components
  };
  const options = { new: true, upsert: true }; 
  try{
    const updatedForm = await Form.findOneAndUpdate({}, formData, options).exec();
    if(updatedForm){
      sendResponse(res, true, 'Form created successfully', updatedForm, 200);
    }else{
      sendResponse(res, false, 'Unalble to update form',updatedForm,400)
    }
    return;
  }catch(err){
    sendResponse(res, false,'Something went wrong',err,500);
    return;
  }
  
};

export const getForm = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try{
    const formResponse = await Form.findOne({});
    if(formResponse){
      sendResponse(res, true, 'Form fetched successfully', formResponse, 200);
    }else{
      sendResponse(res, false, 'Unalble to fetch form',formResponse,400)
    }
    return;
  }catch(err){
    sendResponse(res, false,'Something went wrong',err,500);
    return;
  }
        
 
}