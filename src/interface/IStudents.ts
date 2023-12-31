import { Document } from "mongoose";

export interface IStudent extends Document {
  // prefix: string;
  firstname: string;
  middlename: string;
  lastname: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  dateOfBirth: Date;
  age: number;
  // photo: string;
  schoolName: string;
  studentClass: string;
  schoolCity: string;
  schoolAddress: string;
  schoolPincode: string;
  gender: string;
  storedBy: any;
  other: {};
}

export interface QueryParameters {
  page?: string;
  limit?: string;
  search?: string;
  selectedFilter?: string;
  filterValue?: string;
}

export interface StudentHistoryQuery {
  page: number;
  pageSize: number;
}
