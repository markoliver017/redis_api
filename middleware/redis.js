const { SESSION_SECRET } = process.env;

const Redis = require("redis");
const session = require('express-session');
const RedisStore = require('connect-redis').default;

const redisClient = Redis.createClient({
    url: 'redis://192.168.145.75:6379'
});

(async () => {
    try {
        await redisClient.connect();
        console.log('Redis Client Connected');
    } catch (err) {
        console.log('Redis Client Connection Error', err);
    }
})();

//example logging of redis keys
(async () => {
    try {
        const keys = await redisClient.keys('*');
        console.log(keys);
        
    } catch (err) {
        console.error('Error:', err);
    }
})();

sessionMiddleware = session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET || 'default_secret',
    resave: false,
    rolling: true, // This ensures the expiration is refreshed on every request
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 120000 } 
});

module.exports = {
    sessionMiddleware,
    redisClient
}
