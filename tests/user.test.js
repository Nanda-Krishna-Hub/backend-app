const mongoose = require('mongoose');
const request = require('supertest');
const redis = require('../utils/redisClient');
const sendEmail = require('../utils/sendEmail');
const app = require('../app');
const User = require('../models/user');
const config = require('../config/config');


//  Mock the sendEmail value to true.

jest.mock('../utils/sendEmail', () => ({
    sendEmail: jest.fn().mockResolvedValue(true),
}))

let accessToken;

beforeAll(async () => {
    await mongoose.connect(config.mongo_url);
    await User.deleteMany({});
    await redis.flushall();

    await request(app)
        .post('/api/auth/register')
        .send({
            name: "test user name",
            email: "testuseremail123@email.com",
            password: 'password',
            role: "admin"
        });
    
    // Manually set user as verified
    const user = await User.findOne({email: "testuseremail123@email.com"});
    user.isVerified = true;
    await user.save();
    
    const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
            email: "testuseremail123@email.com",
            password: 'password'
        })
    accessToken = loginResponse.body.accessToken;
    
}); 


afterAll(async() => {
    await mongoose.disconnect();
    await redis.quit();
})


describe('GET /api/users', () => {
    it('should return paginated users for authorized users', async() => {
        const res = await request(app)
            .get('/api/users/users?name=user&page=1')
            .set('Authorization', `Bearer ${accessToken}`)


        expect(res.statusCode).toBe(200)
        expect(res.body.data).toBeInstanceOf(Array)
        expect(res.body.total).toBeGreaterThan(0);
    })
    it('should return 400 if no token provided ', async () => {
        const res = await request(app)
            .get('/api/users/users?page=1&limit=5')
        
        expect(res.statusCode).toBe(400)
        expect(res.body.message).toMatch(/No token provided/i);
            
    })
})