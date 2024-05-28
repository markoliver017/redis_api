require('dotenv').config();

const { ENVIRONMENT, PORT, API_KEY, SERVER_HOST } = process.env;

const cors = require('cors');

// Define allowed origins
const allowedOrigins = ['http://localhost'];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true); // Allow requests with no origin (e.g., mobile apps, curl requests)

        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }

        return callback(null, true); // Allow origin if it matches
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'], // Specify allowed headers
    credentials: true, // Allow cookies to be sent
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

const corsMiddleware = cors(corsOptions);

// Middleware to check API key and host
const checkApiKeyAndHost = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    const requestHost = req.get('host');

    if (requestHost !== `${SERVER_HOST}:${PORT}`) {
        return res.status(403).json({ error: 'Forbidden: Invalid host' });
    }
    
    if (apiKey !== API_KEY) {
        return res.status(403).json({ error: 'Forbidden: Invalid API key' });
    }
    
    next();
};

module.exports = {
    corsMiddleware,
    checkApiKeyAndHost
};
