
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sendEmail = require('../utils/sendEmail')
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const config = require('../config/config')


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
    try {
        const users = await User.find(query).skip((page - 1) * limit).limit(Number(limit)).sort({ createdAt: -1 });
        const total = await User.countDocuments(query);
        return res.json({ total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit), data: users });

    }
    catch (err) {
        return res.status(500).json({ message: "Error fetching details: ", error: err });
    }
}

const getUserData = (req, res) => {
    return res.json({ message: "This is can be accessed by both user and admin" });
}

const getAdminData = (req, res) => {
    return res.json({ message: "This is can be accessed by admin only" });
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