import express from 'express';

const webRouter = express.Router();

webRouter.get('/test', (req, res) => {
  res.send('Hello, Express.js!');
});

// Export the router
export default webRouter;
