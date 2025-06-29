const jwt = require('jsonwebtoken');
const redis = require('../utils/redisClient');
const appError = require('../utils/AppError');
const {verifyAccessToken, verifyEmailToken} = require('../Services/tokenService')

const auth = async (req, res, next) => {
    // const token = req.headers.authorization?.split(' ')[1];
    // if(!token) return res.status(401).json({message: "Token not found"});
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        throw new appError("No token provided", 400)
    }
    const token = authHeader.split(' ')[1];
    try{
        const isBlacklisted = await redis.get(`bl_token:${token}`)
        if(isBlacklisted) throw new appError("Token has been revoked", 401)
        const decoded = verifyAccessToken(token);
        req.user = decoded;
        next();
    }
    catch(err){
        throw new appError("Invalid token or Token expired")
    }
}

module.exports = auth;