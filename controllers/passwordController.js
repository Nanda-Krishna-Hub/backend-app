
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail')

const forgotPassword = async (req, res) => {
    console.log("Request body: ", req.body)
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const token = generateToken({ userId: user._id }, config.jwtsecret, '15m');

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();

        // Send email
        const resetLink = `http:localhost:3000/reset-password/${token}`

        await sendEmail(user.email, "Reset password",
            `<p>Hi ${user.name || 'user'},</p><p>Click <a href = ${resetLink}>here</a> to reset your password </p>`
        );

        return res.json({ message: "Reset password link sent to email" });
    }
    catch (err) {
        return res.status(500).json({ message: 'Error sending the email : ', error: err.message })
    }
}

const resetPassword = async (req, res) => {
    const {token}  =req.params;
    const {newPassword} = req.body;
    try{
        const decoded = jwt.verify(token, config.jwtsecret);
        const user = await User.findById(decoded.userId);
        if(!user || user.resetPasswordToken !== token || user.resetPasswordExpires < Date.now()){
            return res.status(400).json({message: "Invalid or expired reset token"})
        }
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();
        
        return res.json({message: "Password reset successful"})
    }
    catch (err){
        return res.status(400).json({message: "Invalid or token expired : ", error: err.message});
    }
}

module.exports = {forgotPassword, resetPassword}