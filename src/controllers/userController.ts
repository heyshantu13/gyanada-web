import { Request, Response } from "express";
import User from "../models/user.model";
import { sendResponse } from "../utils/responseHelper";
import {
  AuthenticatedRequest,
  DecodedToken,
} from "../interface/AuthenticatedRequest";
import { IUser } from "../interface/IUser";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import moment from "moment";
import natural from "natural";
import {
  IStudent,
  QueryParameters,
  StudentHistoryQuery,
} from "../interface/IStudents";
import { Student } from "../models/student.model";
const { NlpManager } = require("node-nlp");
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../const/key";
import StudentImage from "../models/image.model";

// import { _signToken } from '../utils/jwtSign';

export const myProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const user: IUser | null = await User.findById(req.user?.userId);
    if (!user) {
      return sendResponse(res, false, "User not found", undefined, 404);
    }
    user.password = "";
    sendResponse(res, true, "Profile retrieved successfully", user);
  } catch (error) {
    sendResponse(
      res,
      false,
      "An error occurred while fetching user",
      undefined,
      500
    );
  }
};

export const createAgent = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    // Validate input fields using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendResponse(res, false, "Validation errors", errors.array(), 400);
    }

    const { fullname, email, password, mobile, dateOfBirth, address } =
      req.body;

    // Check if user with the given email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendResponse(
        res,
        false,
        "User with this email already exists",
        undefined,
        400
      );
    }

    // Handle the uploaded image if present
    let photo;
    if (req.file) {
      photo = req.file.filename;
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 8);
    // Convert the dateOfBirth string to a Date object using moment.js
    const dob = moment(dateOfBirth, "DD/MM/YYYY").toDate();

    // Create a new user object
    const newAgent: IUser = new User({
      fullname,
      email,
      password: hashedPassword,
      role: "agent", // Assuming agents are always created as "agents"
      status: true,
      mobile,
      dateOfBirth: dob,
      photo,
      address,
    });

    // Save the agent to the database
    const agentResult = await newAgent.save();
    agentResult.password = "<>";
    sendResponse(res, true, "Agent created successfully", agentResult, 201);
    return;
  } catch (err) {
    sendResponse(res, false, "Server error", err, 500);
  }
};

export const getAgentsList = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    //case-insensitive search
    const searchRegex = new RegExp(search as string, "i");
    // Calculate the skip
    const skip = (Number(page) - 1) * Number(limit);
    const query: any = {
      role: "agent",
      $or: [
        { fullname: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
        { mobile: { $regex: searchRegex } },
      ],
    };
    const totalCount = await User.countDocuments(query);
    // Calculate the total number of pages based
    const totalPages = Math.ceil(totalCount / Number(limit));
    // Calculate the next page
    const nextPage = Number(page) < totalPages ? Number(page) + 1 : null;
    // Fetch the agents
    const agents = await User.find(query)
      .skip(skip)
      .limit(Number(limit))
      .select("-password");

    const response = {
      agents,
      totalCount,
      currentPage: Number(page),
      nextPage,
      totalPages, // Add the total pages count to the response
    };

    sendResponse(res, true, "Agent list fetched successfully", response, 200);
  } catch (err) {
    sendResponse(res, false, "Server error", err, 500);
  }
};

export const editAgent = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params; // Agent ID to be edited
    const { fullname, email, mobile, dateOfBirth, address } = req.body;

    // Find the agent in the database by ID
    const agent = await User.findById(id);
    if (!agent) {
      return sendResponse(res, false, "Agent not found", undefined, 404);
    }

    // Update the agent's information based on the provided fields
    if (fullname) {
      agent.fullname = fullname;
    }
    if (email) {
      agent.email = email;
    }
    if (mobile) {
      agent.mobile = mobile;
    }
    if (dateOfBirth) {
      agent.dateOfBirth = moment(dateOfBirth, "DD/MM/YYYY").toDate();
    }
    if (address) {
      agent.address = address;
    }

    // Save the updated agent
    await agent.save();

    sendResponse(res, true, "Agent updated successfully", agent, 200);
  } catch (err) {
    sendResponse(res, false, "Server error", err, 500);
  }
};

export const deleteAgent = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params; // Agent ID to be soft deleted

    // Find the agent in the database by ID
    const agent = await User.findById(id);
    if (!agent) {
      return sendResponse(res, false, "Agent not found", undefined, 404);
    }

    // Mark the agent as deleted (soft delete)
    agent.status = false;

    // Save the updated agent
    await agent.save();

    sendResponse(res, true, "Agent deleted successfully", undefined, 200);
  } catch (err) {
    sendResponse(res, false, "Server error", err, 500);
  }
};

export const createStudent = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    // Extract the student data from req.body
    const {
      prefix,
      firstname,
      lastname,
      email,
      phone,
      address,
      city,
      pincode,
      dob,
      age,
      photo,
      schoolName,
      studentClass, // "class" is a reserved keyword, so use "studentClass" instead
      schoolCity,
      schoolAddress,
      schoolPincode,
      other,
      gender,
    } = req.body;

    // Create a new student object using the extracted data
    const newStudent: IStudent = new Student({
      prefix,
      firstname,
      lastname,
      email,
      phone,
      address,
      city,
      pincode,
      dob,
      age,
      photo,
      schoolName,
      studentClass,
      schoolCity,
      schoolAddress,
      schoolPincode,
      other,
      gender,
    });

    // Save the new student to the database
    const savedStudent = await newStudent.save();

    res.status(201).json(savedStudent);
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const searchAndFilterStudents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      page = "1",
      limit = "10",
      search = "",
      selectedFilter = "",
      filterValue = "",
    } = req.query as QueryParameters;

    const searchRegex = new RegExp(search as string, "i");
    const filterValueRegex = new RegExp(filterValue as string, "i");

    const skip = (Number(page) - 1) * Number(limit);

    // Build the query for dynamic filtering
    const query: any = {
      $or: [
        { firstname: { $regex: searchRegex } },
        { lastname: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
      ],
    };

    // Apply dynamic filter if a field is selected
    if (selectedFilter && filterValue) {
      query[selectedFilter] = { $regex: filterValueRegex };
    }

    // console.log(query);

    const totalCount = await Student.countDocuments(query);
    const totalPages = Math.ceil(totalCount / Number(limit));
    const nextPage = Number(page) < totalPages ? Number(page) + 1 : null;

    const students = await Student.find(query).skip(skip).limit(Number(limit));

    const response = {
      students,
      totalCount,
      currentPage: Number(page),
      nextPage,
      totalPages,
    };

    res.status(200).json({ success: true, data: response });
    // res.json({ success: true, data: "Success" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Define an interface for query parameters

export const getStudentHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;
    //case-insensitive search
    // Calculate the skip
    const skip = (Number(page) - 1) * Number(limit);

    const time = new Date();
    time.setHours(time.getHours() - 24);
    const token = req.header("Authorization");
    if (!token) {
      sendResponse(
        res,
        false,
        "Unauthorized Access! Empty Token",
        undefined,
        401
      );
      return;
    }

    const decoded = jwt.verify(token, SECRET_KEY) as DecodedToken;
    const query: any = {
      createdAt: {
        $gte: time,
      },
      storedBy: decoded.userId,
    };
    const totalCount = await Student.countDocuments(query);
    // Calculate the total number of pages based
    const totalPages = Math.ceil(totalCount / Number(limit));
    // Calculate the next page
    const nextPage = Number(page) < totalPages ? Number(page) + 1 : null;
    // Fetch the agents
    const students = await Student.find(query).skip(skip).limit(Number(limit));

    const response = {
      students,
      totalCount,
      currentPage: Number(page),
      nextPage,
      totalPages, // Add the total pages count to the response
    };

    sendResponse(
      res,
      true,
      "Students list fetched successfully",
      response,
      200
    );
  } catch (err) {
    sendResponse(res, false, "Server error", err, 500);
  }
};

export const getStudentsImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(500).json({ success: false, message: "Invalid Id" });
      return;
    }
    // check student for given id
    const student = await Student.findById(id);
    if (!student) {
      res.status(500).json({ success: false, message: "Invalid Id" });
      return;
    }
    const image = await StudentImage.findOne({ studentId: id });
    sendResponse(res, true, "Students image fetched successfully", image, 200);
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

/* V1
export const filterStudents = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { query } = req.body;
  
  // Tokenize the user query using natural NLP library
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(query) ?? [];

  // Define a map of operators and their corresponding MongoDB query operators
  const operatorsMap: { [key: string]: string } = {
    'greater than': '$gt',
    'less than': '$lt',
    'equal to': '$eq',
    'more than': '$gt',
    'is': '$eq',
    'from' : '$eq',
    // 'in school' : '$eq',
    // 'in class' : '$eq',
  };

  // Parse the query to extract field names, operators, and values
  const parsedQuery: { field: string; operator: string; value: number | string }[] = [];
  let currentField: string | null = null;
  let currentOperator: string | null = null;
  let currentValue: number | string | null = null;

  for (const token of tokens) {
    if (['age', 'studentClass', 'city', 'schoolName', 'firstname', 'lastname','schoolCity','schoolPincode'].includes(token)) {
      currentField = token;
    } else if (token in operatorsMap) {
      currentOperator = operatorsMap[token];
    } else {
      const parsedNumber = parseInt(token);
      if (!isNaN(parsedNumber)) {
        currentValue = parsedNumber;
      } else {
        // Handle string values that are not numbers
        currentValue = token;
      }
    }

    if (currentField && currentOperator && currentValue !== null) {
      parsedQuery.push({
        field: currentField,
        operator: currentOperator,
        value: currentValue,
      });

      // Reset the values for the next field
      currentField = null;
      currentOperator = null;
      currentValue = null;
    }
  }

  // Build the final MongoDB query using the parsed information
  const mongoQuery: any = {};
  for (const { field, operator, value } of parsedQuery) {
    if (field === 'age') {
      // Handle age search separately as it's a number field
      mongoQuery[field] = { [operator]: value as number };
    } else {
      // Handle other fields (e.g., text fields) as strings
      mongoQuery[field] = { [operator]: value as string };
    }
  }

  try {
    const results = await Student.find(mongoQuery);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

*/

export const filterStudents = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { query } = req.body;

  // Tokenize the user query using natural NLP library
  const tokenizer = new natural.RegexpTokenizer({ pattern: /[\s,]+/ });
  const tokens = tokenizer.tokenize(query) ?? [];
  console.log(tokens, "tokens");

  // Define a map of operators and their corresponding MongoDB query operators
  const operatorsMap: { [key: string]: string } = {
    greater: "$gt",
    less: "$lt",
    equal: "$eq",
    more: "$gt",
    is: "$eq",
    from: "$eq",
  };

  // Helper function to find the index of a token in the query
  const findTokenIndex = (token: string): number => {
    return tokens.findIndex((t) => t.toLowerCase() === token.toLowerCase());
  };

  // Initialize the MongoDB query object
  const queryObj: any = {};

  // Process each token in the query
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i].toLowerCase();

    // Handle "all" students query
    if (token === "all") {
      try {
        const allStudents = await Student.find({});
        res.json(allStudents);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
      return;
    }

    // Handle query based on token
    switch (token) {
      case "students":
        // Skip the keyword "students"
        break;
      case "female":
        queryObj["gender"] = "female";
        break;
      case "male":
        queryObj["gender"] = "male";
        break;
      case "email": {
        const cityIndex = findTokenIndex("city");
        if (cityIndex !== -1 && cityIndex + 1 < tokens.length) {
          const city = tokens[cityIndex + 1];
          queryObj["email"] = { $exists: true };
          queryObj["city"] = city;
        }
        break;
      }
      case "with": {
        const firstnameIndex = findTokenIndex("names");
        const prefixIndex = findTokenIndex("prefix");
        const patternIndex = findTokenIndex("pattern");
        const ageIndex = findTokenIndex("age");
        const dobIndex = findTokenIndex("dob");
        const studentClassIndex = findTokenIndex("class");
        const otherIndex = findTokenIndex("additional");
        const photoIndex = findTokenIndex("photo");
        const nameIndex = findTokenIndex("name");
        const lastnameIndex = findTokenIndex("names");

        if (firstnameIndex !== -1 && firstnameIndex + 1 < tokens.length) {
          const firstname = tokens[firstnameIndex + 1];
          queryObj["firstname"] = { $regex: new RegExp(`^${firstname}`, "i") };
        } else if (prefixIndex !== -1 && prefixIndex + 1 < tokens.length) {
          const prefix = tokens[prefixIndex + 1];
          queryObj["firstname"] = { $regex: new RegExp(`^${prefix}`, "i") };
        } else if (patternIndex !== -1 && patternIndex + 1 < tokens.length) {
          const pattern = tokens[patternIndex + 1];
          queryObj["phone"] = { $regex: new RegExp(pattern, "i") };
        } else if (ageIndex !== -1 && ageIndex + 2 < tokens.length) {
          const operator = tokens[ageIndex + 1];
          const value = parseInt(tokens[ageIndex + 2]);
          if (
            !isNaN(value) &&
            operator in operatorsMap &&
            operatorsMap[operator] === "$gt"
          ) {
            queryObj["age"] = { [operatorsMap[operator]]: value };
          }
        } else if (dobIndex !== -1 && dobIndex + 1 < tokens.length) {
          const dob = new Date(tokens[dobIndex + 1]);
          if (!isNaN(dob.getTime())) {
            queryObj["dob"] = { $gt: dob };
          }
        } else if (
          studentClassIndex !== -1 &&
          studentClassIndex + 1 < tokens.length
        ) {
          const studentClass = tokens[studentClassIndex + 1];
          queryObj["studentClass"] = studentClass;
        } else if (otherIndex !== -1) {
          queryObj["other"] = { $exists: true };
        } else if (photoIndex !== -1) {
          queryObj["photo"] = { $exists: true };
        } else if (nameIndex !== -1 && nameIndex + 2 < tokens.length) {
          const name = tokens[nameIndex + 2];
          const cityIndex = findTokenIndex("city");
          if (cityIndex !== -1 && cityIndex + 1 < tokens.length) {
            const city = tokens[cityIndex + 1];
            queryObj["name"] = { $regex: new RegExp(name, "i") };
            queryObj["city"] = city;
          }
        } else if (lastnameIndex !== -1 && lastnameIndex + 1 < tokens.length) {
          const lastname = tokens[lastnameIndex + 1];
          const ageIndex = findTokenIndex("age");
          if (ageIndex !== -1 && ageIndex + 2 < tokens.length) {
            const operator = tokens[ageIndex + 1];
            const value = parseInt(tokens[ageIndex + 2]);
            if (
              !isNaN(value) &&
              operator in operatorsMap &&
              operatorsMap[operator] === "$lt"
            ) {
              queryObj["age"] = { [operatorsMap[operator]]: value };
              queryObj["lastname"] = {
                $regex: new RegExp(`^${lastname}`, "i"),
              };
            }
          }
        }
        break;
      }
      case "from": {
        const cityIndex = findTokenIndex("city");
        const schoolNameIndex = findTokenIndex("school");
        const pincodeIndex = findTokenIndex("pincode");
        if (cityIndex !== -1 && cityIndex + 1 < tokens.length) {
          const city = tokens[cityIndex + 1];
          queryObj["city"] = city;
        } else if (
          schoolNameIndex !== -1 &&
          schoolNameIndex + 1 < tokens.length
        ) {
          const schoolName = tokens[schoolNameIndex + 1];
          queryObj["schoolName"] = {
            $in: [schoolName, `${schoolName} college`],
          };
        } else if (pincodeIndex !== -1 && pincodeIndex + 1 < tokens.length) {
          const pincode = tokens[pincodeIndex + 1];
          queryObj["pincode"] = pincode;
        }
        break;
      }
      case "and": {
        const pincodeIndex = findTokenIndex("pincode");
        const studentClassIndex = findTokenIndex("class");
        const ageIndex = findTokenIndex("age");
        const emailIndex = findTokenIndex("email");
        const phoneIndex = findTokenIndex("pattern");

        if (pincodeIndex !== -1 && pincodeIndex + 1 < tokens.length) {
          const pincode = tokens[pincodeIndex + 1];
          queryObj["pincode"] = pincode;
        }

        if (studentClassIndex !== -1 && studentClassIndex + 1 < tokens.length) {
          const studentClass = tokens[studentClassIndex + 1];
          queryObj["studentClass"] = studentClass;
        }

        if (ageIndex !== -1 && ageIndex + 2 < tokens.length) {
          const operator = tokens[ageIndex + 1];
          const value = parseInt(tokens[ageIndex + 2]);
          if (!isNaN(value) && operator in operatorsMap) {
            queryObj["age"] = { [operatorsMap[operator]]: value };
          }
        }

        if (emailIndex !== -1) {
          queryObj["email"] = { $exists: true };
        }

        if (phoneIndex !== -1 && phoneIndex + 1 < tokens.length) {
          const pattern = tokens[phoneIndex + 1];
          queryObj["phone"] = { $regex: new RegExp(`^${pattern}`, "i") };
        }

        break;
      }
      case "or": {
        const cityIndex = findTokenIndex("city");
        const schoolCityIndex = findTokenIndex("schoolcity");
        const studentClassIndex = findTokenIndex("class");

        if (cityIndex !== -1 && cityIndex + 1 < tokens.length) {
          const city = tokens[cityIndex + 1];
          queryObj["city"] = city;
        }

        if (schoolCityIndex !== -1 && schoolCityIndex + 1 < tokens.length) {
          const schoolCity = tokens[schoolCityIndex + 1];
          queryObj["schoolCity"] = schoolCity;
        }

        if (studentClassIndex !== -1 && studentClassIndex + 1 < tokens.length) {
          const studentClass = tokens[studentClassIndex + 1];
          queryObj["studentClass"] = studentClass;
        }

        break;
      }
      default:
        break;
    }
  }

  try {
    // Execute the MongoDB query
    console.log(queryObj, "queryObj");
    const results = await Student.find(queryObj);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// export const filterStudents = async (req: Request, res: Response): Promise<void> => {
//   const { query } = req.body;

//   // Initialize the NLP Manager
//   const manager = new NlpManager({ languages: ['en'] });

//   // Define training data for the NLP model to recognize user queries
//   manager.addDocument('en', 'show me all students', 'allStudents');
//   manager.addDocument('en', 'show me students from %schoolName% or %schoolName% college', 'studentsBySchoolName');
//   manager.addDocument('en', 'show me students from %city% city', 'studentsByCity');
//   manager.addDocument('en', 'show me students from %schoolCity% city', 'studentsBySchoolCity');
//   manager.addDocument('en', 'show me students with name or starting name is %firstname%', 'studentsByFirstName');
//   manager.addDocument('en', 'show me students with lastname or ending name or surname is %lastname%', 'studentsByLastName');
//   manager.addDocument('en', 'show me students from %pincode% area', 'studentsByPincode');
//   manager.addDocument('en', 'show me students whose name is similar to %firstname% or %lastname%', 'studentsBySimilarName');
//   manager.addDocument('en', 'show me students from %city% area or %pincode% area', 'studentsByCityOrPincode');
//   manager.addDocument('en', 'show me students whose age is more than 18 years or equal to 18 years', 'studentsByAge');
//   manager.addDocument('en', 'show me students who are in %studentClass% class and in %schoolName% school or college', 'studentsByClassAndSchool');
//   manager.addDocument('en', 'show me students from %schoolCity% or %schoolAddress% and who are in %studentClass%', 'studentsBySchoolCityOrAddressAndClass');
//   manager.addDocument('en', 'show me all %gender% students from %studentClass% or from %schoolName% school or college', 'studentsByGenderAndClassOrSchool');
//   manager.addDocument('en', 'show me latest students from %studentClass% and from %schoolName% college or school', 'latestStudentsByClassAndSchool');

//   // Train the NLP model
//   await manager.train();

//   // Process the user query using the trained NLP model
//   const response = await manager.process('en', query);
//   const intent = response.intent;
//   const entities = response.entities;

//   // Initialize the MongoDB query object
//   const queryObj: any = {};

//   // Handle the user query based on recognized intent and entities
//   switch (intent) {
//     case 'allStudents': {
//       try {
//         const allStudents = await Student.find({});
//         res.json(allStudents);
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//       }
//       return;
//     }
//     case 'studentsBySchoolName': {
//       if (entities.schoolName && entities.schoolName.length > 0) {
//         const schoolName = entities.schoolName[0].value;
//         queryObj['schoolName'] = { $in: [schoolName, `${schoolName} college`] };
//       }
//       break;
//     }
//     case 'studentsByCity': {
//       if (entities.city && entities.city.length > 0) {
//         const city = entities.city[0].value;
//         queryObj['city'] = city;
//       }
//       break;
//     }
//     case 'studentsBySchoolCity': {
//       if (entities.schoolCity && entities.schoolCity.length > 0) {
//         const schoolCity = entities.schoolCity[0].value;
//         queryObj['schoolCity'] = schoolCity;
//       }
//       break;
//     }
//     case 'studentsByFirstName': {
//       if (entities.firstname && entities.firstname.length > 0) {
//         const firstname = entities.firstname[0].value;
//         queryObj['firstname'] = { $regex: new RegExp(`^${firstname}`, 'i') };
//       }
//       break;
//     }
//     case 'studentsByLastName': {
//       if (entities.lastname && entities.lastname.length > 0) {
//         const lastname = entities.lastname[0].value;
//         queryObj['lastname'] = { $regex: new RegExp(`${lastname}$`, 'i') };
//       }
//       break;
//     }
//     case 'studentsByPincode': {
//       if (entities.pincode && entities.pincode.length > 0) {
//         const pincode = entities.pincode[0].value;
//         queryObj['pincode'] = pincode;
//       }
//       break;
//     }
//     case 'studentsBySimilarName': {
//       if (entities.firstname && entities.firstname.length > 0) {
//         const firstname = entities.firstname[0].value;
//         queryObj['$or'] = [
//           { 'firstname': { $regex: new RegExp(`^${firstname}`, 'i') } },
//           { 'lastname': { $regex: new RegExp(`^${firstname}`, 'i') } },
//         ];
//       } else if (entities.lastname && entities.lastname.length > 0) {
//         const lastname = entities.lastname[0].value;
//         queryObj['$or'] = [
//           { 'firstname': { $regex: new RegExp(`${lastname}$`, 'i') } },
//           { 'lastname': { $regex: new RegExp(`${lastname}$`, 'i') } },
//         ];
//       }
//       break;
//     }
//     case 'studentsByCityOrPincode': {
//       if (entities.city && entities.city.length > 0) {
//         const city = entities.city[0].value;
//         queryObj['city'] = city;
//       } else if (entities.pincode && entities.pincode.length > 0) {
//         const pincode = entities.pincode[0].value;
//         queryObj['pincode'] = pincode;
//       }
//       break;
//     }
//     case 'studentsByAge': {
//       queryObj['age'] = { $gte: 18 };
//       break;
//     }
//     case 'studentsByClassAndSchool': {
//       if (entities.studentClass && entities.studentClass.length > 0 && entities.schoolName && entities.schoolName.length > 0) {
//         const studentClass = entities.studentClass[0].value;
//         const schoolName = entities.schoolName[0].value;
//         queryObj['studentClass'] = studentClass;
//         queryObj['schoolName'] = schoolName;
//       }
//       break;
//     }
//     case 'studentsBySchoolCityOrAddressAndClass': {
//       if (entities.schoolCity && entities.schoolCity.length > 0) {
//         const schoolCity = entities.schoolCity[0].value;
//         queryObj['$or'] = [
//           { 'schoolCity': schoolCity },
//           { 'schoolAddress': schoolCity },
//         ];
//       } else if (entities.schoolAddress && entities.schoolAddress.length > 0) {
//         const schoolAddress = entities.schoolAddress[0].value;
//         queryObj['$or'] = [
//           { 'schoolCity': schoolAddress },
//           { 'schoolAddress': schoolAddress },
//         ];
//       }
//       if (entities.studentClass && entities.studentClass.length > 0) {
//         const studentClass = entities.studentClass[0].value;
//         queryObj['studentClass'] = studentClass;
//       }
//       break;
//     }
//     case 'studentsByGenderAndClassOrSchool': {
//       if (entities.gender && entities.gender.length > 0 && entities.studentClass && entities.studentClass.length > 0) {
//         const gender = entities.gender[0].value;
//         const studentClass = entities.studentClass[0].value;
//         queryObj['gender'] = gender;
//         queryObj['$or'] = [
//           { 'studentClass': studentClass },
//           { 'schoolName': studentClass },
//         ];
//       }
//       break;
//     }
//     case 'latestStudentsByClassAndSchool': {
//       // Implement the "latest" query logic here (e.g., sorting by date, if available)
//       // For this example, let's assume that sorting by the "createdAt" field gives the latest results
//       queryObj['createdAt'] = { $exists: true };
//       break;
//     }
//     default: {
//       // If the NLP model does not recognize the intent, return an error response.
//       res.status(400).json({ error: 'Invalid query. Please try again.' });
//       return;
//     }
//   }

//   try {
//     // Execute the MongoDB query
//     const results = await Student.find(queryObj);
//     res.json(results);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
