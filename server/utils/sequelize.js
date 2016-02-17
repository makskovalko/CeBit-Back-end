var config = require('./../../config');
var sequelizeInstance = require('sequelize');
var sequelize = new sequelizeInstance(config.db.dbname, config.db.user, config.db.password, {
    host: 'localhost',
    dialect: 'mysql',

    pool: {
        max: 100,
        min: 5,
        idle: 10000
    },

    // SQLite only
    storage: 'path/to/database.sqlite'
});

module.exports = sequelize;