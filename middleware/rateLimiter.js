const rateLimiter = require('express-rate-limit')

const limiter = rateLimiter({
    windowMs: 10 * 60 * 60, // 10 Minutes
    max: 2,
    message: {
        message: "Too many requests from this IP, Please try again after 10 min"
    },
    standardHeaders: true,
    legacyHeaders: false
})

module.exports = limiter;