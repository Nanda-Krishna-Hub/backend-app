require('dotenv').config();
const express = require('express');
const path = require('path')
const User = require('./models/user')
const userRoutes = require('./routes/userRoutes')
const uploadRoutes = require('./routes/upload')
const verifyRouter = require('./routes/verify')
// const xss = require('xss-clean');
// const mongoSanitize = require('express-mongo-sanitize');
const errorHandler = require('./middleware/errorHandler')
const logger = require('./utils/logger')
const authRoutes = require('./routes/authRoutes')
const app = express();
// const helmet = require('helmet')



//Middlewares
app.use(express.json());
// app.use(xss());
// app.use(mongoSanitize());
app.use(express.static('public'))

//Logger
app.use(logger)

// Security middlewares
// app.use(helmet());              // Sets secure HTTP headers
// app.use(xss());                 // Prevent XSS attacks
// app.use(mongoSanitize());      // Prevent NoSQL injections


//Routes setup
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes)
app.use('/', uploadRoutes);
app.use('/', verifyRouter);

app.use(errorHandler);

   

module.exports = app;
