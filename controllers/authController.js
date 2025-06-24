
const express = require('express')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Add this if missing
const sendEmail = require('../utils/sendEmail');;
const config = require('../config/config')
const {
    generateAccessToken,
    generateEmailToken,
    generateRefreshToken
} = require('../utils/generateToken')


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("email and password", email, password)
        const user = await User.findOne({ email });
        console.log(user)
        if (!user) return res.status(400).json({ message: "Invalid credentials" });
        if (!user.isVerified) {
            return res.status(401).json({ message: "Please verify your email before login" });
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
        const accessToken = generateAccessToken(user)

        const refreshToken = generateRefreshToken(user)

        return res.json({ accessToken, refreshToken });
    }
    catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "User already exist" });
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
        return res.status(201).json({ message: "User successfully created!" });
    }

    catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

module.exports  = {register, login}