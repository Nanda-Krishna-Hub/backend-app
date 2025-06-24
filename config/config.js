require('dotenv').config()


module.exports = {
    port: process.env.PORT || 3000,
    jwtsecret: process.env.JWT_SECRET,
    refreshsecret: process.env.REFRESH_SECRET,
    emailuser: process.env.EMAIL_USER,
    emailpass: process.env.EMAIL_PASS,
    mongo_url: process.env.MONGO_URL
}