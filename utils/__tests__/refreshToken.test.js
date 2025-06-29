jest.setTimeout(25000);

jest.mock('../../utils/sendEmail', () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
}));

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../app')
const config = require('../../config/config')
const redis = require('../redisClient');
const mongoose = require('mongoose');

const User = require('../../models/user');

let refreshTokenVariable;

beforeAll(async () => {
    await mongoose.connect(config.mongo_url);
    await User.deleteMany({});
    // await redis.flushall();

    await request(app)
        .post('/api/auth/register')
        .send({
            name: "testuserrefresh",
            email: "testuserrefresh@email.com",
            password: "password",
            role: "user"
        });

    const user =  await User.findOne({email: "testuserrefresh@email.com"});
    user.isVerified = true;
    await user.save();

    const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
            email: "testuserrefresh@email.com",
            password: "password"
        });

    refreshTokenVariable = loginResponse.body.refreshToken;

});

afterAll( async () => {
    await mongoose.disconnect();
    await redis.quit();
})

describe('POST /api/users/refresh-token', () => {
    it("returns the accessToken from the refreshToken", async () => {
        const res = await request(app)
            .post('/api/users/refresh-token')
            .send({
                refreshToken: refreshTokenVariable
            })
        expect(res.statusCode).toBe(200)
        expect(res.body.accessToken).toBeDefined()
    });

    it('should return 401 error for no refreshToken', async () => {
        const res = await request(app)
            .post('/api/users/refresh-token')
            .send({ refreshToken: ""})
        expect(res.statusCode).toBe(401)
        expect(res.body.message).toMatch(/No refreshToken provided/i)
    })

    it('should return 403 error for invalid refreshToken', async () => {
        const res = await request(app)
            .post('/api/users/refresh-token')
            .send({refreshToken: "invalidtoken"})

        expect(res.statusCode).toBe(403)
        expect(res.body.message).toMatch(/Invalid or expired token/i)
    })
})