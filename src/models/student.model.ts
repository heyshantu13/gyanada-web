import { IStudent } from "../interface/IStudents";
import { Document, Model, model, Schema } from "mongoose";

const studentSchema: Schema<IStudent> = new Schema(
  {
    firstname: String,
    middlename: String,
    lastname: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    pincode: String,
    dateOfBirth: Date,
    age: Number,
    gender: String,
    schoolName: String,
    studentClass: String,
    schoolCity: String,
    schoolAddress: String,
    schoolPincode: String,
    storedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    other: {},
  },
  { timestamps: true }
);

studentSchema.index({ firstname: 1 });
studentSchema.index({ lastname: 1 });
studentSchema.index({ email: 1 });
studentSchema.index({ phone: 1 });
studentSchema.index({ city: 1 });
studentSchema.index({ pincode: 1 });
studentSchema.index({ schoolName: 1 });
studentSchema.index({ class: 1 });
studentSchema.index({ schoolCity: 1 });
studentSchema.index({ schoolAddress: 1 });
studentSchema.index({ schoolPincode: 1 });
studentSchema.index({ storedBy: 1 });
studentSchema.index({ gender: 1 });

// Set the text indexes
studentSchema.index({
  firstname: "text",
  lastname: "text",
  schoolName: "text",
  city: "text",
  class: "text",
  gender: "text",
  schoolCity: "text",
  schoolAddress: "text",
  schoolPincode: "text",
  email: "text",
  storedBy: "text",
  phone: "text",
});

export const Student: Model<IStudent> = model<IStudent>(
  "Student",
  studentSchema
);
