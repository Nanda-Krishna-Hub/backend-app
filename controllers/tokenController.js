const jwt = require('jsonwebtoken');
const config = require('../config/config');
const redis = require('../utils/redisClient')

const {verifyRefreshToken, generateAccessToken} = require('../Services/tokenService')
const appError = require('../utils/AppError')


const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    // console.log(req.user.role)
    // console.log(config.jwtsecret)
    if (!refreshToken) throw new appError("No refreshToken provided", 401);
    try {
        const decoded = verifyRefreshToken(refreshToken)
        const user = {
            _id: decoded.userId,
            role: decoded.role
        }
        const storedToken = await redis.get(`refresh:${user._id}`);

        if(!storedToken || storedToken !== refreshToken){
            throw new appError("Invalid or expired token", 403);
        }
        const newAccessToken = generateAccessToken(user);
        return res.json({ accessToken: newAccessToken })
    }
    catch (err) {
         throw new appError( "Invalid or expired token", 403 )
    }
}


module.exports = {refreshToken}