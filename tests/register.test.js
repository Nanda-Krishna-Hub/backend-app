jest.mock("../utils/sendEmail", () =>  jest.fn().mockResolvedValue(true))

const request = require('supertest');

const app = require('../app');


const mongoose = require('mongoose');

const User = require('../models/user');
const config = require('../config/config')
const redis = require("../utils/redisClient")

beforeAll(async () => {
    await mongoose.connect(config.mongo_url);
    await User.deleteMany({});
    await redis.flushall();
})

afterAll(async () => {
    await mongoose.disconnect();
    await redis.quit();
})


describe ("POST /api/auth/register", () => {
    it("Should register new user and return success message", async ()=> {
        const res = await request(app)
        .post('/api/auth/register')
        .send({
            name: "user 123",
            email: "testuseremail@email.com",
            password: 'testuser',
            role: 'user'
        });
        expect(res.statusCode).toBe(201);
    
        expect(res.body.message).toBe("User successfully created!");
    
        const user = await User.findOne({email: "testuseremail@email.com"});
        expect(user).toBeTruthy();
    });

    it("Should return 400 if user already exists", async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Register tester',
                email: "testuseremail@email.com",
                password: 'testuser',
                role: 'user',
            });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("User already exist")
    });


});

