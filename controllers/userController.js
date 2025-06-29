
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sendEmail = require('../utils/sendEmail')
const bcrypt = require('bcryptjs');
const config = require('../config/config')
const redis = require('../utils/redisClient')


const getAllUsers = async (req, res) => {
    const users = await User.find();
    return res.json(users)
}

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) return res.status(404).json({ message: "user not found" })
        return res.json(user);
    }
    catch (err) {
        console.log("Error in /profile", err);
        return res.status(500).json({ error: err })
    }
}

const getUsersPagination = async (req, res) => {
    const { page = 1, limit = 10, name, email } = req.query;
    const query = {};
    if (name) query.name = { $regex: name, $options: 'i' }
    if (email) query.email = { $regex: email, $options: 'i' };
    const redisKey = `users:${JSON.stringify(req.query)}`;
    console.log(redisKey)

    try {
        const cached = await redis.get(redisKey);
        if(cached){
            // console.log("Users fetched from Redis cache");
            return res.json(JSON.parse(cached))
        }
        const users = await User.find(query).skip((page - 1) * limit).limit(Number(limit)).sort({ createdAt: -1 });
        const total = await User.countDocuments(query);
        const response = {total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit), data: users };
        await redis.set(redisKey, JSON.stringify(response), 'EX', 60);
        // console.log(JSON.stringify(response));
        return res.json(response);
    }
    catch (err) {
        console.error("❌ Error in /users route:", err);
        return res.status(500).json({ 
        message: "Error fetching details",
        error: err?.message || "Unknown error"
    });
    }
}

const getUserData = (req, res) => {
    return res.json({ message: "Welcome Human" });
}

const getAdminData = (req, res) => {
    return res.json({ message: "Welcome Admin!" });
}

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" })
        res.json(user);
    }
    catch (err) {
        return res.status(404).json({ message: "Invalid ID" });
    }
}

const registerNewUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { name, email } = req.body;
    const exist = User.findOne({ email });
    if (exist) return res.status(404).json({ message: "User already exist!" })
    const user = new User({ name, email })
    await user.save()
    if (!name || !email) {
        return res.status(400).send("Please enter email and name")
    }
    else {
        res.status(201).json(user)
    }
}


const updateUserById = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { name, email } = req.body
    const user = await User.findByIdAndUpdate(req.params.id, { name, email }, { new: true })
    if (!user) return res.status(404).json({ message: "User not found" })
    res.json(user);
}

const deleteUserById = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "Invalid UserId" });
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User Deleted" })
}

const getAllOtherRoutes = (req, res) => {
    res.status(404).send("Page not found");
};



module.exports = {
    getAllUsers,
    getUserProfile,
    getUsersPagination,
    getUserData,
    getAdminData,
    getUserById,
    registerNewUser,
    updateUserById,
    deleteUserById,
    getAllOtherRoutes
}