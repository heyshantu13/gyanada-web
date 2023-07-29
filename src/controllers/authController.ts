import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.model';
import { sendResponse } from '../utils/responseHelper';
import { _signToken } from '../utils/jwtSign';
import { IUser } from '../interface/IUser';

const _verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  // Check if email and password are provided in the request body
  if (!email || !password) {
    return sendResponse(res, false, 'Email and password are required', undefined, 400);
  }
  try {
    const user: IUser | null = await User.findOne({ email });

    if (!user) {
      return sendResponse(res, false, 'User not found', undefined, 404);
    }

    const isPasswordValid = await _verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return sendResponse(res, false, 'Invalid credentials', undefined, 401);
    }

    const token = _signToken(user);
    sendResponse(res, true, 'Login successful', { token, role: user.role });
  } catch (error) {
    sendResponse(res, false, 'An error occurred during login', undefined, 500);
  }
};

// Controller for user signup
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullname, email, password, role} = req.body;

    // Check if user with the given email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendResponse(res, false, 'User with this email already exists', undefined, 400);
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 8);

    // Create a new user object
    const newUser: IUser = new User({
      fullname,
      email,
      password: hashedPassword,
      role
    });

    // Save the user to the database
    await newUser.save();

    // Generate a JWT token and send it in the response
    const token = _signToken(newUser);
    sendResponse(res, true, 'User created successfully', { token }, 201);
  } catch (error) {
    sendResponse(res, false, 'Server error', undefined, 500);
  }
};