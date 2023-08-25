import { Schema, model } from 'mongoose';
import { IStudentImage } from '../interface/IStudentImage';

const ImageSchema: Schema<IStudentImage> = new Schema({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
  },
  data: Buffer,
  type: String,
});

const StudentImage = model<IStudentImage>('StudentImage', ImageSchema);

export default StudentImage;
