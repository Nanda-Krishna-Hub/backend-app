
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/config');
const {verifyEmailToken} = require('../Services/tokenService')
const appError = require('../utils/AppError')

const verifyEmail = async (req, res, next) => {
    try {
        const decoded = verifyEmailToken(req.params.token);
        console.log("user clicked")
        await User.findByIdAndUpdate(decoded.Id, { isVerified: true });
        return res.send("Email verified successfully");
    }
    catch (err) {
        next(err)
    }
}

module.exports = {verifyEmail}