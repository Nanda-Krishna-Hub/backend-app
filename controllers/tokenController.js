const jwt = require('jsonwebtoken');
const config = require('../config/config');
const {
    generateAccessToken,
}    = require('../utils/generateToken')

const refreshToken = (req, res) => {
    const { refreshToken } = req.body;
    // console.log(req.user.role)
    console.log(config.jwtsecret)
    if (!refreshToken) return res.status(401).json({ message: "No refreshToken provided" });
    try {
        const decoded = jwt.verify(refreshToken, config.refreshsecret);
        const user = {
            _id: decoded.userId,
            role: decoded.role
        }
        const newAccessToken = generateAccessToken(user);
        return res.json({ accessToken: newAccessToken })
    }
    catch (err) {
        return res.status(403).json({ message: "Invalid refresh token" })
    }
}


module.exports = {refreshToken}