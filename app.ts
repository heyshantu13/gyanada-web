import express from 'express';
import cors from 'cors';
import multer from 'multer';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import moment from 'moment';
import mongoose from 'mongoose';

dotenv.config();

// Replace 'myDatabase' with the name of your database

// Local MongoDB connection string
const localConnectionUri = `mongodb+srv://gyanadaApp:gyanadaapp@gyanadaapp.wr38ooy.mongodb.net/?retryWrites=true&w=majority`;

// Create the connection to the database
mongoose.connect(localConnectionUri);

// Get the default connection
const db = mongoose.connection;

// Handle connection events
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB database successfully!');
});

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello, Express.js!');
});

// Start the server
const port = process.env.PORT || 8081;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
