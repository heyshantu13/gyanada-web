import mongoose from 'mongoose';
import { Student } from '../models/student.model';
import { studentsData } from './students';

// Function to seed the data into the database
const seedData = async (): Promise<void> => {
  try {
    const dbUri = process.argv[2]; // Get the MongoDB connection string from command-line argument
    await mongoose.connect(dbUri);

    // Create students in the database using the existing Student model
    await Student.create(studentsData);

    console.log('Data seeded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.disconnect();
  }
};

// Call the seedData function to start seeding the data
seedData();
