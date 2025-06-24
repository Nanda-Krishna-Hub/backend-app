const jwt = require('jsonwebtoken');
const config = require('../config/config')

// const generateToken = (payload, secret , expiresIn) => {
//     return jwt.sign(payload, secret, { expiresIn });
// }
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
    generateRefreshToken, 
    generateAccessToken, 
    generateEmailToken
};