require('dotenv').config();
const {ENVIRONMENT, SESSION_SECRET, PORT, API_KEY, SERVER_HOST } = process.env; 

const express = require("express");
const session = require('express-session');
const axios = require("axios");
const cors = require("cors");
const RedisStore = require('connect-redis').default;
const Redis = require("redis");

const redisClient = Redis.createClient({
    url: 'redis://192.168.145.75:6379',
});

(async () => {
    await redisClient.connect();
})();
redisClient.on('connect', () => console.log('Redis Client Connected') );
redisClient.on('error', (err) => console.log('Redis Client Connection Error', err));

const app = express();

app.use(express.json());

// Define allowed origins
const allowedOrigins = ['http://localhost'];

const corsOptions = {
    origin: function (origin, callback) {

        if (!origin && ENVIRONMENT === 'development') return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'], // Specify allowed headers
    credentials: true, // Allow cookies to be sent
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

const apiKeyMiddleware = (req, res, next) => {
    
    const apiKey = req.headers['x-api-key'];
    const requestHost = req.get('host');
    // if (requestHost === `${SERVER_HOST}:${PORT}` && ENVIRONMENT == 'development') {
    //     return next();
    // }
    if (apiKey !== API_KEY) {
        const msg = 'Forbidden: Invalid API key';
        console.log(msg + ' ' + apiKey)
        return res.status(403).json({ error: msg });
    }
    next();
};

app.use(cors(corsOptions));
app.use(apiKeyMiddleware);

app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 120000 } 
}));

// Middleware to refresh session TTL
app.use((req, res, next) => {
    if (req.session) {
        req.session.save(err => {
            if (err) {
                console.error('Session save error:', err);
            }
            next();
        });
    } else {
        next();
    }
});

app.get('/example-endpoint', (req, res) => {
    res.json({ message: 'This is a CORS-enabled endpoint.' });
});

app.get('/set-session', (req, res) => {
    req.session.user = { id: 1, username: 'exampleUser' };
    res.send('Session data has been set.');
});


app.get("/photos", async (req,res) => {
    const albumId = req.query.albumId;
    const { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/photos",
        { params: { albumId } }
    );

    res.json(data);

});

app.get('/get-session', (req, res) => {
    if (req.session.user) {
        res.send(`Session data: ${JSON.stringify(req.session.user)}`);
    } else {
        res.send('No session data found.');
    }
});

app.get("/photos/:id", async (req, res) => {
    
    const { data } = await axios.get(
        `https://jsonplaceholder.typicode.com/photos/${req.params.id}`
    );
    redisClient.setEx("photos", 3600, JSON.stringify(data));

    res.json(data);
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

//example logging of redis keys
(async () => {
    try {
        const value = await redisClient.get('photos');
        console.log(value);

        console.log(await redisClient.ttl('photos'));
        
    } catch (err) {
        console.error('Error:', err);
    }
})();

