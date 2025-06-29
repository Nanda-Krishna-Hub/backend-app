
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
} = require('../Services/tokenService');

const authService = require('../Services/authService')

const login = async (req, res, next) => {
    try{
        const {accessToken, refreshToken} = await authService.loginUser(req.body);
        res.status(201).json({accessToken, refreshToken});
    }
    catch(err){
        next(err);
    }
}

const register = async (req, res, next) => {
    try{
        const result = await authService.registerUser(req.body);
        res.status(201).json(result);
    }
    catch(err){
        next(err);
    }
}


const logout = async (req, res, next) => {
    try{
        const result = await authService.logoutUser(req)
        res.status(200).json(result)
    }
    catch(err){
        next(err)
    }
}





module.exports  = {register, login, logout}