var SequelizeBase = require('sequelize');
var sequelize = require('./../utils/sequelize');

var UserCategory = sequelize.define('user_category', {

    id: {
        field: 'id',
        type: SequelizeBase.INTEGER,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        field: 'user_id',
        type: SequelizeBase.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    category_id: {
        field: 'category_id',
        type: SequelizeBase.INTEGER,
        references: {
            model: 'categories',
            key: 'id'
        }
    }

});


module.exports = UserCategory;