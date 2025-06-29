require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose')
const config = require('./config/config');
const http = require('http')
const { Server } = require('socket.io');
const app = require('./app')


mongoose.connect(config.mongo_url)
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch((err) => console.error("MongoDB connection error:", err));



    const server = http.createServer(app);
    const io = new Server(server, {
    cors: {
        origin: "*", // Allow connections from any frontend during development
        methods: ["GET", "POST"]    // Allow these HTTP methods
    }
});

io.on('connection', (socket) => {
    console.log("New client connected: ", socket.id);

    socket.on('message', (data) => {
        console.log("Received message: ", data);
        socket.broadcast.emit('message: ', data)
    });

    socket.on('disconnect', () => {
        console.log('client disconnected: ', socket.id)
    })
})




server.listen(config.port, () => {
    console.log(`Server started at port: ${config.port}`);
}); 