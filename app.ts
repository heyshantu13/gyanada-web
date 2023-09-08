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

// Replace 'myDatabase' with the name of your database

// Local MongoDB connection string
const localConnectionUri = `mongodb+srv://gyanadaApp:gyanadaapp@gyanadaapp.wr38ooy.mongodb.net/?retryWrites=true&w=majority`;

// Create the connection to the database
mongoose.connect(localConnectionUri);

// Get the default connection
const db = mongoose.connection;

// Handle connection events
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB database successfully!");
});

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/web", webRouter);

// Routes
app.get("/", (req, res) => {
  res.send("Hello, Express.js!");
});

// Start the server
const ipAddress = "192.168.160.134";
const PORT = process.env.PORT || 8002;
app.listen(+PORT, ipAddress, () => {
  Student.ensureIndexes();
  console.log(`Server is running on port http://${ipAddress}:${PORT}`);
});
