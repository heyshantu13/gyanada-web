import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  fullname: string;
  email: string;
  password: string;
  role: string;
  token: string;
  status: boolean;
}

const userSchema: Schema<IUser> = new Schema({
  fullname: { type: String, required: true },
  token: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['agent', 'admin'], default: 'agent' },
  status: { type: Boolean, default: false } // Set default value to false
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
