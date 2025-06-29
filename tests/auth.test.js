const app = require('../app');
const mongoose = require('mongoose');
const config = require('../config/config');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const request = require('supertest')
const redis = require('../utils/redisClient')


beforeAll(async () => {
    // connect to test Database
    await mongoose.connect(config.mongo_url);
    await User.deleteMany({});
    await redis.flushall();
    // Adding user to database

    const hashedPassword = await bcrypt.hash('test123', 10);
    await User.create({
        name: 'test user',
        email: "testuser@email.com",
        role: "user",
        isVerified: true,
        password: hashedPassword
    });

})

afterAll(async () => {
    await mongoose.disconnect();
    await redis.quit();
})

describe('POST api/auth/login', () => {
    it('should login successfully and return access and refresh tokens', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: "testuser@email.com",
                password: 'test123',
            });

            expect(res.statusCode).toBe(201);
            expect(res.body.accessToken).toBeDefined();
            expect(res.body.refreshToken).toBeDefined();

    })
    it('should return 400 for the invalid credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: "testuser@email.com",
                password: 'wrongpassword',
            })
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Invalid credentials")
    })
})