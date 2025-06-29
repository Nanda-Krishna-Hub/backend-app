const Redis = require('ioredis');

const config = require('../config/config');

const redis = new Redis(config.redis_url);

redis.on('connect', () => { console.log('Connected to redis')});

redis.on('error', (err) => {console.log('Redis error: ', err)});

module.exports = redis;

