import { Request, Response } from "express";
import User from "../models/user.model";
import { sendResponse } from "../utils/responseHelper";
import { IDashboard } from "../interface/IDashboard";

export const dashboard = async (req: Request, res: Response): Promise<void> => {
  try{
    const totalAgents = await User.countDocuments({ role: 'agent', status: true });
    const dashboard: IDashboard = {
      totalStudents: 0, 
      totalAgents: totalAgents, 
      totalEvents: 0, 
      recentlyJoined: [],
    };
    sendResponse(res,true,'success',dashboard,200);
    return; 
  }catch(err){
    sendResponse(res,false,'error',err,500);
    return;
  }
 
};