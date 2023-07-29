import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  fullname: string;
  token: string;
  email: string;
  password: string;
  role: string;
  status: boolean;
  mobile: string;
  dateOfBirth: Date;
  photo?: string;
  address: string;
}
