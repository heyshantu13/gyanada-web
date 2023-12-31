import express from "express";
import cors from "cors";
import multer from "multer";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import moment from "moment";
import mongoose from "mongoose";
import webRouter from "./src/routes/web.routes";
import path from "path";
import { Student } from "./src/models/student.model";

dotenv.config();

// const atEnv =
// Local MongoDB connection string
const dbConnection = 'mongodb://gyanada_sandbox_user:SandboxP%40%24%24w0rd%212%24Secure@ec2-13-232-230-93.ap-south-1.compute.amazonaws.com:27017/gyanada_sandbox';

// local conn str 
// const localConnStr = "mongodb://localhost:27017"

// Create the connection to the database
mongoose.connect(dbConnection);

// Get the default connection
const db = mongoose.connection;

// Handle connection events
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB database successfully!");
});

const app = express();

// Middleware
app.use(cors({ origin: "*" })); // Allow requests from all origins
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/web", webRouter);

// Routes
app.get("/", (req, res) => {
  res.send("Hello, Express.js!");
});

// Start the server
const ipAddress = process.env.LOCAL_IP; // only for local
const PORT = process.env.PORT || 8081;

if (ipAddress) {
  app.listen(+PORT, ipAddress, () => {
    Student.ensureIndexes();
    console.log(`Server is running on port http://${ipAddress}:${PORT}`);
  });
} else {
  app.listen(PORT, () => {
    Student.ensureIndexes();
    console.log(`Server is running on port ${PORT}`);
  });
}
