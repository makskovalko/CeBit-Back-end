var env = process.env.NODE_ENV || 'dev';
var db = require('./database.json');

var config = {
    server: {
        host: process.env.HOST || "0.0.0.0",
        port: process.env.PORT || "3240",
        baseURL: "http://127.0.0.1:3240"
    },
    db: {
        host: process.env.DB_HOST || db[env].host,
        port: parseInt(process.env.DB_PORT) || 3306,
        dbname: process.env.DB_NAME || db[env].database,
        user: process.env.DB_USER || db[env].user,
        password: process.env.DB_PASSWORD ||  db[env].password,
        charset: 'utf8mb4',
        connectionRetryCount: 5,
        delayBeforeReconnect: 3000,
        showErrors: true
    },
    security: {
        signature: 'xieiyeh-ejjud'
    }
};

module.exports = config;