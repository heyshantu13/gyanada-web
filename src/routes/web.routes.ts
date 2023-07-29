import express from 'express';
import multer from 'multer';
import { body, check } from 'express-validator';
import { login, signup } from '../controllers/authController';
import { authorizedUser } from '../middleware/authorizedUser';
import { createAgent, getAgentsList, myProfile } from '../controllers/userController';
import {storage,fileFilter} from '../utils/multer';
const upload = multer({ storage, fileFilter });
const webRouter = express.Router();

webRouter.get('/test', (req, res) => {
  res.send('Hello, Express.js!');
});


webRouter.post('/register',[],signup);
webRouter.post('/login',[],login);

// Protected routes
webRouter.get('/my-profile',authorizedUser,myProfile);
// agents routes
webRouter.post('/user/agent/create',  [authorizedUser,upload.single('photo')],
  [
    body('fullname').notEmpty().withMessage('Fullname is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('photo').custom((value, { req }) => {
    // Validate the uploaded file (photo)
      if (!req.file) {
        throw new Error('Photo is required');
      }
      return true;
    }),
  ],
  createAgent);

webRouter.get('/user/agent/list',authorizedUser,getAgentsList);

// Export the router
export default webRouter;
