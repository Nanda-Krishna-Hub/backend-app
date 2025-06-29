
const config = require('../config/config')
const jwt = require('jsonwebtoken');


const verifyAccessToken = (token) => {
    const result = jwt.verify(token, config.jwtsecret);
    return result
}


const verifyEmailToken = (token) => {
    const result = jwt.verify(token, config.jwtsecret);
    return result
}


const verifyRefreshToken = (token) => {
    const result = jwt.verify(token, config.refreshsecret);
    return result;
}

const generateAccessToken = (user) => {
    console.log(user)
    return jwt.sign({userId: user._id, role: user.role}, config.jwtsecret, {expiresIn: '15m'} )
}

const generateRefreshToken = (user) => {
    return jwt.sign({userId: user._id, role: user.role}, config.refreshsecret, {expiresIn: '7d'} )
}

const generateEmailToken = (userId) => {
    return jwt.sign({Id: userId}, config.jwtsecret, {expiresIn: '15m'} )
}

module.exports = {
    verifyAccessToken,
    verifyEmailToken,
    verifyRefreshToken,
    generateRefreshToken, 
    generateAccessToken, 
    generateEmailToken
}