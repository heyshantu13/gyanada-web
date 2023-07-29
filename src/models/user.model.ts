import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../interface/IUser';

const userSchema: Schema<IUser> = new Schema({
  fullname: { type: String, required: true },
  token: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['agent', 'admin'], default: 'agent' },
  status: { type: Boolean, default: true },
  mobile: { type: String},
  dateOfBirth: { type: Date },
  photo: { type: String },
  address: { type: String, },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
