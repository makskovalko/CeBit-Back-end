'use strict';

let User = require('../models/users');
let UserCategory = require('../models/user_category');
let Match = require('../models/matches');
let sequelize = require('./../utils/sequelize');
let DataRepository = require('../repository/DataRepository');
let randToken = require('rand-token');

class UserController {

    loginOrCreateNewUser(req, res, next) {
        let userData = req.body;
        let accessToken = req.headers['authorization'];

        if (!userData) return res.json({status: 400, error: "Incorrect body!"});

        if (!accessToken) accessToken = randToken.generate(16);

        User.findOrCreate({ where: { access_token: accessToken }, defaults: userData }).spread((user, created) => {
            return res.json(user);
        }).catch((err) => {
            return res.json(err);
        });

    }

    getUserById(req, res, next) {
        let userId = req.params.id;

        User.findById(userId).then((dbUser) => {
            if (!dbUser) return res.json({ status: 400, error: "Incorrect user's id!" });
            return res.json(dbUser);
        }).catch((err) => {
            return res.json(err);
        })
    }

    updateUser(req, res, next) {
        let userId = req.params.id;
        let userData = req.body;
        let accessToken = req.headers['authorization'];

        if (!userData || (!accessToken))
            return res.json({ status: 400, error: "Permissions denied! You need right access token!" });

        User.findOne({ where: { access_token: accessToken } }).then((result) => {
            if (!result) return res.json({ status: 400, error: "Permissions denied! You need right access token!" });
        }).then(() => {

            User.findById(userId).then((user) => {
                if (!user) return res.json({ status: 400, error: "Incorrect user's id!" });
                user.update(userData);
                return res.json(user);
            }).catch((err) => {
                return res.json(err);
            });

        }).catch((err) => {
            return res.json(err);
        });
    }

    deleteUser(req, res, next) {

        let userId = req.params.id;
        User.destroy({where: {id: userId}}).then((result) => {
            if (result == 0) return res.json({status: 400, error: "Incorrect user's id!"});
            Match.destroy({ where: { $or: [{sender_id: userId}, {recipient_id: userId}] }}).then((dbData) => {
                UserCategory.destroy({ where: { user_id: userId } }).then((data) => {
                    return res.json(result);
                })
            });
        }).catch((err) => {
            return res.json(err);
        });
    }

    getAll(req, res, next) {
        User.findAll().then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.json(err);
        });
    }

    addCategoriesForUser(req, res, next) {
        let userId = req.params.id;
        let accessToken = req.headers['authorization'];

        User.findOne({where: {id: userId, access_token: accessToken}}).then((result) => {
            if (!result) return res.status(400).json({ status: 400, error: "Incorrect user's data!" });

            if (!req.body || !req.body.categories)
                return res.json({ status: 400, error: "Incorrect body!" });

            let categories = req.body.categories;

            let user_category = [];
            for (let i = 0; i < categories.length; i++)
                user_category.push({ user_id: userId, category_id: categories[i] });

            UserCategory.bulkCreate(user_category).then((result) => {
                let categoryData = {
                    user_id: result.user_id,
                    category_id: result.category_id
                };
                return res.json(user_category);
            }).catch((err) => {
                return res.json(err);
            })

        }).catch((err) => {
            return res.json(err);
        });

    }

    getCategoriesByUser(req, res, next) {
        let userId = req.params.id;
        let accessToken = req.headers['authorization'];

        User.findOne({where: {id: userId, access_token: accessToken}}).then((result) => {
            if (!result) return res.status(400).json({status: 400, error: "Incorrect user's data!"});

            sequelize.query(DataRepository.getAllCategoriesByUser(userId),
                {replacements: {user_id: userId}}).then((result) => {

                    let resArray = result[0];
                    let formatResult = [];

                    for (let i = 0; i < resArray.length; i++) {

                        let obj = {
                            user_id: resArray[i].user_id,
                            category: {
                                id: resArray[i].category_id,
                                name: resArray[i].name
                            }
                        };

                        formatResult.push(obj);
                    }

                    return res.json(formatResult);

                }).catch((err) => {
                    return res.json(err);
                });
        });
    }

    deleteCategoriesByUser(req, res, next) {
        let userId = req.params.id;
        let accessToken = req.headers['authorization'];

        User.findOne({where: {id: userId, access_token: accessToken}}).then((result) => {
            if (!result) return res.status(400).json({status: 400, error: "Incorrect user's data!"});

            if (!req.body || !req.body.categories)
                return res.json({status: 400, error: "Incorrect body!"});
            let categories = req.body.categories;
            for (let i = 0; i < categories.length; i++) {
                UserCategory.destroy({where: {user_id: userId, category_id: categories[i]}}).then((result) => {
                    if (result == 0) return res.status(400).json({status: 400, error: "Incorrect data!"});
                    return res.json({ status: 20, message: "Categories was deleted successfully!" });
                }).catch((err) => {
                    return res.json(err);
                });
            }
        });
    }

    acceptMatch(req, res, next) {
        let userId = req.params.userId;
        let matchData = req.body;
        let accessToken = req.headers['authorization'];

        User.findOne({where: {id: userId, access_token: accessToken} }).then((result) => {
            if (!result) return res.status(400).json({status: 400, error: "Incorrect user's id!"});

            if (!matchData || (matchData && !matchData.recipient_id))
                return res.json({status: 400, error: "Incorrect body!"});

            matchData.is_approved = 0;
            matchData.date = Date.now();

            Match.findOne({where: {sender_id: userId, recipient_id: matchData.recipient_id}}).then((result) => {
                if (result) return res.json({status: 400, error: "This match already exists!"});

                Match.findOne({where: {recipient_id: userId, sender_id: matchData.recipient_id}}).then((match) => {
                    if (match) {
                        let newMatch = {};
                        newMatch.is_approved = 1;
                        match.update(newMatch);
                        return res.json(match)
                    } else {
                        matchData.sender_id = userId;
                        Match.create(matchData).then((result) => {
                            return res.json(result);
                        }).catch((err) => {
                            return res.json(err);
                        });
                    }
                }).catch((err) => {
                    return res.json(err);
                });
            });
        });
    }

    declineMatch(req, res, next) {
        let userId = req.params.userId;
        let matchData = req.body;
        let accessToken = req.headers['authorization'];

        User.findOne({where: {id: userId, access_token: accessToken}}).then((result) => {
            if (!result) return res.status(400).json({status: 400, error: "Incorrect user's id!"});

            if (!matchData || (matchData && !matchData.recipient_id))
                return res.json({status: 400, error: "Incorrect body!"});

            Match.findOne({where: {recipient_id: userId, sender_id: matchData.recipient_id}}).then((dbMatch) => {
                if (dbMatch) {
                    Match.destroy({where: {recipient_id: userId, sender_id: matchData.recipient_id, is_approved: 0}}).then((result) => {
                        return result == 0 ? res.json({status: 400, error: "Incorrect input data!"})
                            : res.json(dbMatch);
                    }).catch((err) => {
                        return res.json(err);
                    });
                } else {
                    return res.json({status: 200, error: "Match was declined!"});
                }

            });
        });
    }

    getMatchesByUser(req, res, next) {
        let id = req.params.userId;
        let accessToken = req.headers['authorization'];

        User.findOne({ where: { access_token: accessToken } }).then((user) => {
            if (!user) return res.status(400).json({ status: 400, error: "Incorrect access token!" });
        }).then(() => {
            Match.findAll({where: {$and: {is_approved: 1, $or: [{sender_id: id}, {recipient_id: id}]}}})
                .then((result) => {
                    return res.json(result);
                }).catch((err) => {
                    return res.json(err);
                });
        }).catch((err) => {
            return res.json(err);
        });
    }

    deleteMatch(req, res, next) {
        let id = req.params.id;
        let accessToken = req.headers['authorization'];

        User.findOne({where:{ access_token: accessToken }}).then((user) => {
            if (!user) return res.status(400).json({ status: 400, error: "Incorrect access token!" });
        }).then(() => {
            Match.destroy({ where: { id: id } }).then((result) => {
                console.log(result);
                if (!result) return res.status(400).json({ status: 400, error: "Incorrect match id!" });
                return res.json({ status: 200, message: "Match was deleted successfully!" });
            }).catch((err) => {
                return res.json(err);
            })
        }).catch((err) => {
            return res.json(err);
        })

    }

    getNewCandidate(req, res, next) {
        let userId = req.params.userId;
        let accessToken = req.headers['authorization'];

        User.findOne({where: {id: userId, access_token: accessToken}}).then((result) => {
            if (!result) return res.status(400).json({status: 400, error: "Incorrect user's id!"});

            if (!req.body || !req.body.categories)
                return res.json({status: 400, error: "Incorrect body!"});
            let categories = req.body.categories;

            let query;
            if (categories == -1) {
                query = DataRepository.getAllCandidates(userId);
            } else {
                let catStr = "(";
                for (let i = 0; i < categories.length; i++)
                    catStr += (categories[i] + (i != categories.length - 1 ? "," : ")"));

                query = DataRepository.getAllCandidatesByCategory(userId, catStr);
            }

            sequelize.query(query).then((result) => {
                if (result.length == 0) {
                    query = DataRepository.getAllCandidates(userId);
                    sequelize.query(query).then((result) => {
                        return res.json(result[0]);
                    })
                }
                return res.json(result[0]);
            }).catch((err) => {
                return res.json(err);
            });
        });

    }

    getCountOfNeurons(req, res, next) {
        User.findAndCountAll().then((result) => {
            return res.json({ count: result.count });
        }).catch((err) => {
            return res.json(err);
        });
    }

    getCountOfMatches(req, res, next) {
        Match.findAndCountAll().then((result) => {
            return res.json({ count: result.count });
        }).catch((err) => {
            return res.json(err);
        });
    }

    static checkAccessToken(accessToken, callback) {
        User.findOne({ access_token: accessToken }).then((result) => {
            callback(result);
        }).catch((err) => {
            return res.json(err);
        });
    }

}

module.exports = new UserController();