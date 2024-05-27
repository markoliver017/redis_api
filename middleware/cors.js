require('dotenv').config();

const {ENVIRONMENT, PORT, API_KEY, SERVER_HOST } = process.env; 

const cors = require("cors");
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

corsMiddleware = cors(corsOptions);

const apiKeyMiddleware = (req, res, next) => {
    
    const apiKey = req.headers['x-api-key'];
    const requestHost = req.get('host');
    if (requestHost === `${SERVER_HOST}:${PORT}` && ENVIRONMENT == 'development') {
        return next();
    }
    if (apiKey !== API_KEY) {
        const msg = 'Forbidden: Invalid API key';
        console.log(msg + ' ' + apiKey)
        return res.status(403).json({ error: msg });
    }
    next();
};

module.exports = {
    corsMiddleware: corsMiddleware,
    apiKeyMiddleware: apiKeyMiddleware
}