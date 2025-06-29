const express = require('express')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Add this if missing
const sendEmail = require('../utils/sendEmail');;
const config = require('../config/config');
const redis = require('../utils/redisClient');

const {
    generateAccessToken,
    generateEmailToken,
    generateRefreshToken
} = require('../Services/tokenService')

const appError = require('../utils/AppError');
const { verifyAccessToken } = require('./tokenService');

const loginUser = async ({email, password}) => {
        const user = await User.findOne({ email });
        if (!user) throw new appError("Invalid credentials", 400);
        if (!user.isVerified) {
            throw new appError ("Please verify your email before login", 401) ;
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) throw new appError("Invalid credentials", 400);
        const accessToken = generateAccessToken(user)

        const refreshToken = generateRefreshToken(user);

        await redis.set(`refresh:${user._id}`, refreshToken, 'EX', 7*24*60*60 );
        const storedToken = await redis.get(`refresh:${user._id}`);
        console.log("StoredToken: ", storedToken)
        console.log('redis token set')

        return { accessToken, refreshToken };
}



const registerUser = async ( {name, email, password, role} ) => {
            const existing = await User.findOne({ email });
            if (existing) throw new appError( "User already exist", 400);
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ name: name, email: email, password: hashedPassword, role: role });
            await user.save();
            const token = generateEmailToken(user._id);
            const verifyLink = `http://localhost:3000/verify-email/${token}`;
            console.log(verifyLink)
            await sendEmail(user.email, "Verify your email", `
                <h2>Welcome, ${user.name}!</h2>
                <p>Click below link to verify your email: </p>
                <a href = "${verifyLink}">Verify Email</a>
                `
            )
            return { message: "User successfully created!" };
    
}

const logoutUser = async (req) => {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            throw new appError("No token provided", 401);
        }
        const token = authHeader.split(' ')[1];

        const decoded = verifyAccessToken(token);
        const now = Math.floor(Date.now()/1000);
        const TotalExpTime = decoded.exp - now;
        if(TotalExpTime > 0) await redis.set(`bl_token:${token}`, '1', 'EX', TotalExpTime);
        await redis.del(`refresh:${decoded.userId}`);
        return {message: "User logged out successfully"};
}



module.exports = {loginUser, registerUser, logoutUser}