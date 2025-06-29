const jwt = require('jsonwebtoken');

const {generateAccessToken} = require('../../Services/tokenService');

const config = require('../../config/config');

describe('generateAccessToken', () => {
    it('Should return a valid JWT token', () => {
        const mockUser = {
            _id: 'user123',
            role: 'user'
        }
    
    
    const token = generateAccessToken(mockUser);
    expect(typeof token).toBe('string');

    const decoded = jwt.verify(token, config.jwtsecret);
    expect(decoded.userId).toBe(mockUser._id);
    expect(decoded.role).toBe(mockUser.role);
    })
})