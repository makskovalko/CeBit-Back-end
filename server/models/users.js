var SequelizeBase = require('sequelize');
var sequelize = require('./../utils/sequelize');

var Users = sequelize.define('users', {

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
    },
    last_name: {
        field: 'last_name',
        type: SequelizeBase.STRING
    },
    middle_name: {
        field: 'middle_name',
        type: SequelizeBase.STRING
    },
    country: {
        field: 'country',
        type: SequelizeBase.STRING
    },
    city: {
        field: 'city',
        type: SequelizeBase.STRING
    },
    email: {
        field: 'email',
        type: SequelizeBase.STRING
    },
    phone_number: {
        field: 'phone_number',
        type: SequelizeBase.STRING
    },
    date_of_birth: {
        field: 'date_of_birth',
        type: SequelizeBase.STRING
    },
    profile_image: {
        field: 'profile_image',
        type: SequelizeBase.STRING
    },
    about_me: {
        field: 'about_me',
        type: SequelizeBase.TEXT
    },
    contact_data: {
        field: 'contact_data',
        type: SequelizeBase.STRING
    },
    role: {
        field: 'role',
        type: SequelizeBase.STRING
    },
    auth_type: {
        field: 'auth_type',
        type: SequelizeBase.STRING
    },
    access_token: {
        field: 'access_token',
        type: SequelizeBase.TEXT
    },
    place_of_work: {
        field: 'place_of_work',
        type: SequelizeBase.TEXT
    },
    position: {
        field: 'position',
        type: SequelizeBase.TEXT
    }
});


module.exports = Users;