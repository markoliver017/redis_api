require('dotenv').config();
const { PORT, SERVER_HOST } = process.env; 

const express = require("express");
const connection = require('./database/connection');
const routes = require('./system/utilities/Routes');
const axios = require("axios");

const {corsMiddleware} = require('./middleware/cors')
// const { sessionMiddleware, redisClient  } = require('./middleware/redis');

const app = express();

/***** start middlewares config using app.use()  *****/
app.use(express.json());

//body parser for form data
app.use(express.urlencoded({ extended: true }));

// serving static contents - express function 
app.use(express.static(__dirname + "/static"));

// This sets the location where express will look for the ejs views
app.set('views', __dirname + '/application/views');
// Now lets set the view engine itself so that express knows that we are using ejs as opposed to another templating engine like jade
app.set('view engine', 'ejs');

app.use(corsMiddleware);
// app.use(sessionMiddleware);

/* set the router configurations as default route in running this framework */
app.use('/',routes);

// Middleware to refresh session in REDIS TTL
// app.use(async (req, res, next) => {

//     console.log(req.session.session_id);
//     console.log(req.session);
//     console.log(await redisClient.get('sess:'+req.session.session_id))
//     console.log(await redisClient.keys('*'))
//     if(req.session){
//         req.session.touch();
//         // req.session.save(err => {
//         //     if (err) {
//         //         console.error('Session save error:', err);
//         //     }
//         // });
//     }
//     next();
    
// });

/************  end of middlewares ****************/

// app.get('/login', (req, res) => {
//     // req.session.session_id = req.session.id;
//     res.render('index');
// });

// app.get('/sample', (req, res) => {
//     res.send("sample view")
// });

// app.get('/api/session/example-endpoint', async (req, res) => {
//     res.json({ message: 'This is a CORS-enabled endpoint.' });
// });

// app.get('/api/get-session/:sess', (req, res) => {
//     return redisClient.get(req.params.sess);
// });



// app.get("/users", async (req, res) => {
//     try {
//         const limit = 10;
//         const offset = 0;

//         const [row] = await connection.query(
//                             `SELECT *, CONCAT(user_lname, ', ', user_fname, ' ', COALESCE(user_mname, '') ) as fullname
//                             from af_userinfo
//                             LIMIT ?, ?
//                             `,
//                             [offset, limit]
//                         );
        
//         res.render('users', {users: row});
//         // res.json(row);

//     }catch(err){
//         res.status(500).send(err.toString());
//     }
// })

// app.get("/users/:id", async (req, res) => {
//     const employee_no = req.params.id;

//     const [row] = await connection.query(
//         `SELECT *, CONCAT(user_lname,', ',user_fname, ' ',COALESCE(user_mname, '') ) as fullname
//         FROM af_userinfo
//         WHERE employee_id = ?
//         `,
//         [employee_no]
//     );
//     res.render('users', {users: row});
//     // res.json(row);
// })


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`${SERVER_HOST}:${PORT}/`);
});


