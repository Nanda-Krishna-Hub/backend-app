
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/config')

const verifyEmail = async (req, res) => {
    try {
        const decoded = jwt.verify(req.params.token, config.jwtsecret);
        console.log("user clicked")
        await User.findByIdAndUpdate(decoded.id, { isVerified: true });
        return res.send("Email verified successfully");
    }
    catch (err) {
        return res.status(400).send("Invalid or expired verification link")
    }
}


module.exports = {verifyEmail}