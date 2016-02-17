var SequelizeBase = require('sequelize');
var sequelize = require('./../utils/sequelize');

var Messages = sequelize.define('messages', {

    id: {
        field: 'id',
        type: SequelizeBase.INTEGER,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    sender_id: {
        field: 'sender_id',
        type: SequelizeBase.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    recipient_id: {
        field: 'recipient_id',
        type: SequelizeBase.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    date: {
        field: 'date',
        type: SequelizeBase.DATE
    },
    message: {
        field: 'message',
        type: SequelizeBase.TEXT
    }

});


module.exports = Messages;