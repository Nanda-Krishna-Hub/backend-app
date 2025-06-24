const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user');
const {body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const user = require('../models/user');
const checkRole = require('../middleware/checkRole')
const sendEmail = require('../utils/sendEmail');
const rateLimiter = require('../middleware/rateLimiter');
const userController = require('../controllers/userController')
const passwordController = require('../controllers/passwordController');
const tokenController = require('../controllers/tokenController');
const emailController = require('../controllers/emailController');
const app = express();

app.use(express.json());

const router = express.Router();


//Routes
// router.post('/data', (req, res) => {
//     console.log("Sanitized data is : " + req.body.name);
// })



// Verify email
router.get('/verify-email/:token', emailController.verifyEmail)

//Forgot password
router.post('/forgot-password', passwordController.forgotPassword);

//Refresh-Token

router.post('/refresh-token', tokenController.refreshToken)

//Get all the users
router.get('/', userController.getAllUsers);

//Get user profile
router.get('/profile', auth, userController.getUserProfile)

//Get users
router.get('/users', auth, checkRole('admin'), userController.getUsersPagination)


router.get('/user-data', auth, checkRole('user', 'admin'), userController.getUserData)

router.get('/admin-data', auth, checkRole('admin'), userController.getAdminData)

//Get user by ID
router.get('/:id', userController.getUserById)

// Register new user
router.post('/', 
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Enter valid email')
    ],
    userController.registerNewUser
)

//Update the user by Id
router.put('/:id', 
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage("Enter a valid email")
    ],
    userController.updateUserById
)

// Delete the user by Id
router.delete('/:id', userController.deleteUserById)

//Catch all the other routes
router.use(userController.getAllOtherRoutes);



module.exports = router; 