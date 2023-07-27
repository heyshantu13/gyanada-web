import jwt from 'jsonwebtoken';
// Load environment variables from .env file
import dotenv from 'dotenv';
import { IUser } from '../interface/IUser';
dotenv.config();

type ProcessEnv = {
  [key: string]: string | undefined;
};

const env: ProcessEnv = process.env;
const secretKey = env.SECRET_KEY!; // Use non-null assertion here

export const _signToken = (user: IUser): string => {
  return jwt.sign({ userId: user._id,fullname:user.fullname }, secretKey, { expiresIn: '48h' });
};
