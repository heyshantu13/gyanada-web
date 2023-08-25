import { Request, Response } from "express";
import Form from "../models/form.model";
import { sendResponse } from "../utils/responseHelper";
import { AuthenticatedRequest, DecodedToken } from "../interface/AuthenticatedRequest";
import { IForm } from "../interface/IForm";
import jwt from "jsonwebtoken";
import { error } from "console";
import { IStudent } from "../interface/IStudents";
import { Student } from "../models/student.model";
import moment from "moment";
import StudentImage from "../models/image.model";
import { type } from "os";

export const saveStudentData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // const { basicDetails, contactDetails, educationalDetails, other } = req.body.data.form;
    const data = req.body.data.form;
    const token = req.header("Authorization") || false;
    if (!token)
      return sendResponse(
        res,
        false,
        "Your Token Is Not Valid. Please Relogin",
        {},
        401
      );
    const decoded = jwt.decode(token) as DecodedToken;

    const newStudent: IStudent = new Student({
      firstname: data?.basicDetails?.firstName,
      middlename: data?.basicDetails?.middleName,
      lastname: data?.basicDetails?.lastName,
      email: data?.contactDetails?.email,
      phone: data?.contactDetails?.phone,
      address: `${data?.contactDetails?.buildingHouseNo} ${data?.contactDetails?.street}`,
      city: data?.contactDetails?.cityVillageSuburb,
      pincode: data?.contactDetails?.pincode,
      dateOfBirth: moment(
        data?.basicDetails?.dateOfBirth,
        "DD/MM/YYYY"
      ).toDate(),
      age: data?.basicDetails?.age,
      photo: data?.educationalDetails?.schoolName,
      schoolName: data?.educationalDetails?.schoolName,
      studentClass: data?.educationalDetails?.studentClass,
      schoolCity: data?.educationalDetails?.schoolCity,
      schoolAddress: data?.educationalDetails?.schoolAddress,
      schoolPincode: data?.educationalDetails?.schoolPincode,
      gender: data?.basicDetails?.gender,
      storedBy: decoded?.userId,
      other: { ...data?.other },
    });


    await newStudent.save();

    const dataBuffer = Buffer.from(data?.file[0]?.url, 'base64');
    // console.log(dataBuffer);
    const newImage = new StudentImage({
      studentId: newStudent._id,
      data: dataBuffer,
      type: data?.file[0]?.type,
    });

    // console.log(newImage);


    await newImage.save();

    // console.log('Successfully saved');
    sendResponse(res, true, 'Student Added Succesfully', newStudent, 201);
  } catch (err) {
    // error message
    console.log(err);
    sendResponse(res, false, 'Server Error', undefined, 500);

    return;
  }
};
export const storeForm = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { display, components } = req.body;
  const formData = {
    display: display,
    components: components,
  };
  const options = { new: true, upsert: true };
  try {
    const updatedForm = await Form.findOneAndUpdate(
      {},
      formData,
      options
    ).exec();
    if (updatedForm) {
      sendResponse(res, true, "Form created successfully", updatedForm, 200);
    } else {
      sendResponse(res, false, "Unalble to update form", updatedForm, 400);
    }
    return;
  } catch (err) {
    sendResponse(res, false, "Something went wrong", err, 500);
    return;
  }
};

export const getForm = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const formResponse = await Form.findOne({});
    if (formResponse) {
      sendResponse(res, true, "Form fetched successfully", formResponse, 200);
    } else {
      sendResponse(res, false, "Unalble to fetch form", formResponse, 400);
    }
    return;
  } catch (err) {
    sendResponse(res, false, "Something went wrong", err, 500);
    return;
  }
};
