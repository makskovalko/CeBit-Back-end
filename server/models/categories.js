var SequelizeBase = require('sequelize');
var sequelize = require('./../utils/sequelize');

var Categories = sequelize.define('categories', {

    id: {
        field: 'id',
        type: SequelizeBase.INTEGER,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: SequelizeBase.STRING,
        field: 'name'
    }
});


module.exports = Categories;