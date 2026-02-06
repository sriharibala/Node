const express = require('express');
const Router = express.Router();
const userController = require('../Controller/userController');
const { protect } = require('../Middleware/authMiddleware'); 
const { isAdmin } = require('../Middleware/adminMiddleware'); // ✅ ADD
const fileController = require('../Controller/fileController');
const multer = require('multer');
const upload = multer({ dest: 'Uploads/' }); // Configure multer for file uploads
// validation

const { registerValidation, loginValidation, employeeValidation } = require('../Validation/userValidation');
const { validate } = require('../Middleware/validation');

// Public routes
Router.post('/register', registerValidation, validate, userController.registerUser);
Router.post('/login', loginValidation, validate, userController.loginUser);
Router.post('/create', employeeValidation, validate, protect, isAdmin, userController.createEmployee);
// Router/userRouter.js
Router.post('/refresh-token', userController.refreshToken);

Router.post('/logout', protect, userController.logoutUser);

Router.post('/upload', upload.single('file'), fileController.uploadFile);

// Protected route
Router.get('/protected', protect, (req, res) => { 
  console.log('Protected route accessed');
  res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = Router;
