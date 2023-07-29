import { Request, Response } from 'express';
import User from '../models/user.model';
import { sendResponse } from '../utils/responseHelper';
import { AuthenticatedRequest } from '../interface/AuthenticatedRequest';
import { IUser } from '../interface/IUser';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import moment from 'moment';
// import { _signToken } from '../utils/jwtSign';

export const myProfile = async (req: AuthenticatedRequest , res: Response): Promise<void> => { 
  try{
    const user: IUser | null = await User.findById(req.user?.userId);
    if (!user) {
      return sendResponse(res, false, 'User not found', undefined, 404);
    }
    user.password = "";
    sendResponse(res, true, 'Profile retrieved successfully', user);
  }catch(error){
    sendResponse(res, false, 'An error occurred while fetching user', undefined, 500);
  }
}

export const createAgent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Validate input fields using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendResponse(res, false, 'Validation errors', errors.array(), 400);
    }

    const { fullname, email, password, mobile, dateOfBirth, address } = req.body;

    // Check if user with the given email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendResponse(res, false, 'User with this email already exists', undefined, 400);
    }

    // Handle the uploaded image if present
    let photo;
    if (req.file) {
      photo = req.file.filename;
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 8);
    // Convert the dateOfBirth string to a Date object using moment.js
    const dob = moment(dateOfBirth, 'DD/MM/YYYY').toDate();

    // Create a new user object
    const newAgent: IUser = new User({
      fullname,
      email,
      password: hashedPassword,
      role: 'agent', // Assuming agents are always created as "agents"
      status: true,
      mobile,
      dateOfBirth:dob,
      photo,
      address,
    });

    // Save the agent to the database
    const agentResult =  await newAgent.save();
    agentResult.password = "<>"
    sendResponse(res, true, 'Agent created successfully', agentResult, 201);
    return;
  } catch (err) {
    sendResponse(res, false, 'Server error', err, 500);
  }
};

export const getAgentsList = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    //case-insensitive search
    const searchRegex = new RegExp(search as string, 'i');
    // Calculate the skip 
    const skip = (Number(page) - 1) * Number(limit);
    const query: any = {
      role: 'agent',
      $or: [
        { fullname: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
        { mobile: { $regex: searchRegex } },
      ],
    };
    const totalCount = await User.countDocuments(query);
    // Calculate the total number of pages based
    const totalPages = Math.ceil(totalCount / Number(limit));
    // Calculate the next page
    const nextPage = Number(page) < totalPages ? Number(page) + 1 : null;
    // Fetch the agents
    const agents = await User.find(query)
      .skip(skip)
      .limit(Number(limit))
      .select('-password'); 

    const response = {
      agents,
      totalCount,
      currentPage: Number(page),
      nextPage,
      totalPages, // Add the total pages count to the response
    };

    sendResponse(res, true, 'Agent list fetched successfully', response, 200);
  } catch (err) {
    sendResponse(res, false, 'Server error', err, 500);
  }
};

export const editAgent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // Agent ID to be edited
    const { fullname, email, mobile, dateOfBirth, address } = req.body;

    // Find the agent in the database by ID
    const agent = await User.findById(id);
    if (!agent) {
      return sendResponse(res, false, 'Agent not found', undefined, 404);
    }

    // Update the agent's information based on the provided fields
    if (fullname) {
      agent.fullname = fullname;
    }
    if (email) {
      agent.email = email;
    }
    if (mobile) {
      agent.mobile = mobile;
    }
    if (dateOfBirth) {
      agent.dateOfBirth = moment(dateOfBirth, 'DD/MM/YYYY').toDate();
    }
    if (address) {
      agent.address = address;
    }

    // Save the updated agent
    await agent.save();

    sendResponse(res, true, 'Agent updated successfully', agent, 200);
  } catch (err) {
    sendResponse(res, false, 'Server error', err, 500);
  }
};

export const deleteAgent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // Agent ID to be soft deleted

    // Find the agent in the database by ID
    const agent = await User.findById(id);
    if (!agent) {
      return sendResponse(res, false, 'Agent not found', undefined, 404);
    }

    // Mark the agent as deleted (soft delete)
    agent.status = false;

    // Save the updated agent
    await agent.save();

    sendResponse(res, true, 'Agent deleted successfully', undefined, 200);
  } catch (err) {
    sendResponse(res, false, 'Server error', err, 500);
  }
};
