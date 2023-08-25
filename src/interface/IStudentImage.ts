import { Document } from "mongoose";

export interface IStudentImage extends Document {
  studentId: any;
  data: Buffer;
  type: string;
}
