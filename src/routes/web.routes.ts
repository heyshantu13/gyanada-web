import express from 'express';
import multer from 'multer';
import { body, check } from 'express-validator';
import { login, signup } from '../controllers/authController';
import { authorizedUser } from '../middleware/authorizedUser';
import { createAgent, createStudent, deleteAgent, editAgent, filterStudents, getAgentsList, myProfile } from '../controllers/userController';
import {storage,fileFilter} from '../utils/multer';
import { getForm, saveStudentData, storeForm } from '../controllers/formController';
import { uploadProfile } from '../controllers/uploadController';
import { dashboard } from '../controllers/dashboardController';
const upload = multer({ storage, fileFilter });
const webRouter = express.Router();

webRouter.get('/test', (req, res) => {
  res.send('Hello, Express.js!');
});


webRouter.post('/register',[],signup);
webRouter.post('/login',[],login);

webRouter.post('/upload/photo',upload.single('file'),uploadProfile)
// Protected routes
webRouter.get('/dashboard',authorizedUser,dashboard);
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
webRouter.put('/user/agent/:id/update',authorizedUser,editAgent);
webRouter.delete('/user/agent/:id/delete', authorizedUser, deleteAgent);

// FOrm Management Services
webRouter.put('/form/update',authorizedUser,storeForm);
webRouter.get('/form/get',authorizedUser,getForm);
webRouter.post('/form/store', authorizedUser, saveStudentData);


// Students
webRouter.post('/user/student/search',authorizedUser,filterStudents);
webRouter.post('/user/student/create',authorizedUser,createStudent);



// Export the router
export default webRouter;
