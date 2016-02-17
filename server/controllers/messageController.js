'use strict';

let Message = require('../models/messages');
let User = require('../models/users');

class MessageController {

    sendMessage(req, res, next) {
        let message = req.body;
        let accessToken = req.headers['authorization'];
        message.date = Date.now();

        User.findOne({ where: { id: message.sender_id, access_token: accessToken } }).then((result) => {
            if (!result) return res.status(400).json({ status: 400, error: "Permissions denied! Invalid token!" });
        }).then(() => {
            Message.create(message).then((result) => {
                return res.json(result);
            }).catch((err) => {
                return res.json(err);
            });
        }).catch((err) => {
            return res.json(err);
        });
    }

    getMessageById(req, res, next) {
        let messageId = req.params.id;
        Message.findOne({ id: messageId }).then((message) => {
            return res.json(message);
        }).catch((err) => {
            return res.json(err);
        });
    }

    deleteMessage(req, res, next) {
        let messageId = req.params.id;
        Message.destroy({ where: { id: messageId } }).then((message) => {
            return res.json(message);
        }).catch((err) => {
            return res.json(err);
        });
    }

    getAllInboxMessages(req, res, next) {
        let userId = req.params.id;
        let accessToken = req.headers['authorization'];

        User.findOne({ where: { id: userId, access_token: accessToken } }).then((result) => {
            if (!result) return res.status(400).json({ status: 400, error: "Permissions denied! Invalid token!" });
        }).then(() => {
            Message.findAll({where: {recipient_id: userId}}).then((result) => {
                return res.json(result);
            }).catch((err) => {
                return res.json(err);
            });
        }).catch((err) => {
            return res.json(err);
        });
    }

    getAllOutboxMessages(req, res, next) {
        let userId = req.params.id;
        let accessToken = req.headers['authorization'];

        User.findOne({ where: { id: userId, access_token: accessToken } }).then((result) => {
            if (!result) return res.status(400).json({ status: 400, error: "Permissions denied! Invalid token!" });
        }).then(() => {
            Message.findAll({where: {sender_id: userId}}).then((result) => {
                return res.json(result);
            }).catch((err) => {
                return res.json(err);
            });
        }).catch((err) => {
            return res.json(err);
        });
    }

}

module.exports = new MessageController();