require('dotenv').config();
const { PORT, SERVER_HOST } = process.env; 

const express = require("express");
const axios = require("axios");

const { corsMiddleware, apiKeyMiddleware } = require('./middleware/cors')
const { sessionMiddleware, redisClient  } = require('./middleware/redis');

const app = express();

/***** start middlewares config using app.use()  *****/
app.use(express.json());
//body parser for form data
app.use(express.urlencoded({ extended: true }));

// serving static contents - express function 
app.use(express.static(__dirname + "/static"));

// This sets the location where express will look for the ejs views
app.set('views', __dirname + '/views'); 
// Now lets set the view engine itself so that express knows that we are using ejs as opposed to another templating engine like jade
app.set('view engine', 'ejs');

app.use(corsMiddleware);
app.use(apiKeyMiddleware);
app.use(sessionMiddleware);

// Middleware to refresh session in REDIS TTL
app.use('/api/session',(req, res, next) => {
    console.log('im on api route')
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

/************  end of middlewares ****************/


app.get('/api/session/example-endpoint', (req, res) => {
    res.json({ message: 'This is a CORS-enabled endpoint.' });
});

// app.get('/set-session', (req, res) => {
//     req.session.user = { id: 1, username: 'exampleUser' };
//     res.send('Session data has been set.');
// });


// app.get("/photos", async (req,res) => {
//     const albumId = req.query.albumId;
//     const { data } = await axios.get(
//         "https://jsonplaceholder.typicode.com/photos",
//         { params: { albumId } }
//     );

//     res.json(data);

// });

// app.get('/get-session', (req, res) => {
//     if (req.session.user) {
//         res.send(`Session data: ${JSON.stringify(req.session.user)}`);
//     } else {
//         res.send('No session data found.');
//     }
// });

// app.get("/photos/:id", async (req, res) => {
    
//     const { data } = await axios.get(
//         `https://jsonplaceholder.typicode.com/photos/${req.params.id}`
//     );
//     redisClient.setEx("photos", 3600, JSON.stringify(data));

//     res.json(data);
// });

app.get("/users/:id/:x", function (request, response){
    // hard-coded user data
    console.log(request.params);
    // const users_array = [
    //     {name: "Michael", email: "michael@codingdojo.com"}, 
    //     {name: "Jay", email: "jay@codingdojo.com"}, 
    //     {name: "Brendan", email: "brendan@codingdojo.com"}, 
    //     {name: "Andrew", email: "andrew@codingdojo.com"}
    // ];
    // response.render('users', {users: users_array});
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`${SERVER_HOST}:${PORT}/`);
});


