const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {type: String},
    email: { type: String, unique: true },
    password: {type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user', required: true },
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpires: Date
}, 
{ timestamps: true }
);


module.exports = mongoose.model('User', userSchema)