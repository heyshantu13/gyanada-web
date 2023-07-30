import { Document } from 'mongoose';

export interface IStudent extends Document {
  prefix: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  dob: Date;
  age: number;
  photo: string;
  schoolName: string;
  studentClass: string;
  schoolCity: string;
  schoolAddress: string;
  schoolPincode: string;
  other: {};
  gender: string;
}
