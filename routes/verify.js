
const User = require('../models/user')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');
const config = require('../config/config');
const passwordController = require('../controllers/passwordController')
const emailController = require('../controllers/emailController')
const router = express.Router();



// Verify email
router.get('/verify-email/:token', emailController.verifyEmail)

//Reset password
router.post('/reset-password/:token', passwordController.resetPassword )



module.exports = router;