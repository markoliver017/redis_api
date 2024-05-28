/** MYSQL Connection **/
const Mysql = require('mysql2/promise');

const connection = Mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'af_hlurb_dev'
});
// const Mysql = require('mysql2');

// const connection = Mysql.createConnection({
//     "host": "localhost",
//     "user": "root",
//     "password": "secret",
//     "database": "mydb",
//     "port": 3306
// });

const bcrypt = require('bcryptjs');

module.exports = {
    connection: connection,
    // Mysql: Mysql,
    bcrypt: bcrypt
};