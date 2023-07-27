import express from 'express';
import { login, signup } from '../controllers/authController';
import { authorizedUser } from '../middleware/authorizedUser';
import { myProfile } from '../controllers/userController';

const webRouter = express.Router();

webRouter.get('/test', (req, res) => {
  res.send('Hello, Express.js!');
});


webRouter.post("/register",[],signup);
webRouter.post("/login",[],login)

// Protected routes
webRouter.get("/my-profile",authorizedUser,myProfile)

// Export the router
export default webRouter;
