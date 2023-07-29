import multer from 'multer';
import { Request } from 'express';
import path from 'path';

// Define the types for the file filter function
type MulterFileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => void;

// Multer file filter configuration
export const fileFilter: MulterFileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(null, false); // Pass null as the first argument when there is no error
  }
};

// Multer storage configuration
export const storage: multer.StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the folder where uploaded images will be stored
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generate a unique filename for the uploaded image
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});
