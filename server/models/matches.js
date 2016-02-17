var SequelizeBase = require('sequelize');
var sequelize = require('./../utils/sequelize');

var Matches = sequelize.define('matches', {

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
    is_approved: {
        field: 'is_approved',
        type: SequelizeBase.INTEGER
    },
    date: {
        field: 'date',
        type: SequelizeBase.DATE
    }
});


module.exports = Matches;