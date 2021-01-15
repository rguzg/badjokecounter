const mysql = require("mysql");
const util = require("util");
const dotenv = require("dotenv");

dotenv.config();

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB_NAME
});

pool.query = util.promisify(pool.query);

module.exports = pool;