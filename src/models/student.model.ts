import { IStudent } from "../interface/IStudents";
import { Document, Model, model, Schema } from 'mongoose';

const studentSchema: Schema<IStudent> = new Schema({
  prefix: String,
  firstname: String,
  lastname: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  pincode: String,
  dob: Date,
  age: Number,
  photo: String,
  schoolName: String,
  studentClass: String,
  schoolCity: String,
  schoolAddress: String,
  schoolPincode: String,
  other: {}
});

// Set the indexes for all the fields
studentSchema.index({ prefix: 1 });
studentSchema.index({ firstname: 1 });
studentSchema.index({ lastname: 1 });
studentSchema.index({ email: 1 });
studentSchema.index({ phone: 1 });
studentSchema.index({ address: 1 });
studentSchema.index({ city: 1 });
studentSchema.index({ pincode: 1 });
studentSchema.index({ dob: 1 });
studentSchema.index({ age: 1 });
studentSchema.index({ photo: 1 });
studentSchema.index({ schoolName: 1 });
studentSchema.index({ class: 1 });
studentSchema.index({ schoolCity: 1 });
studentSchema.index({ schoolAddress: 1 });
studentSchema.index({ schoolPincode: 1 });
studentSchema.index({ gender: 1 });

// Set the text indexes
studentSchema.index({
  firstname: 'text',
  lastname: 'text',
  schoolName: 'text',
  address : 'text',
  city: 'text',
  class: 'text',
  age : 'text',
  gender: 'text', 
  schoolCity: 'text',
  schoolAddress: 'text',
  schoolPincode: 'text',
  email: 'text',
  phone: 'text',
});

export const Student: Model<IStudent> = model<IStudent>('Student', studentSchema);

