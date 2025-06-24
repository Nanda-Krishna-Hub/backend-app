require('dotenv').config();
const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
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
const config = require('./config/config');

mongoose.connect(config.mongo_url)
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch((err) => console.error("MongoDB connection error:", err));



//Middlewares
app.use(express.json());
// app.use(xss());
// app.use(mongoSanitize());
app.use(express.static('public'))

//Logger
app.use(logger)

//Routes setup
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes)
app.use('/', uploadRoutes);
app.use('/', verifyRouter)
app.use(errorHandler);

app.listen(config.port, () => {
    console.log(`Server started at port: ${config.port}`);
});
