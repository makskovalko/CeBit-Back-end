'use strict';

let Category = require('../models/categories');
let UserCategory = require('../models/user_category');
let sequelize = require('./../utils/sequelize');
let DataRepository = require('../repository/DataRepository');

class CategoryController {

    createCategory(req, res, next) {
        let category = req.body;
        Category.create(category).then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.json(err);
        });
    }

    getCategoryById(req, res, next) {
        let categoryId = req.params.id;
        Category.findById(categoryId).then((result) => {
            if (!result) return res.json({ status: 400, error: "Incorrect category id!" });
            return res.json(result);
        }).catch((err) => {
            return res.json(err);
        });
    }

    updateCategory(req, res, next) {
        let categoryId = req.params.id;
        let data = req.body;
        Category.findById(categoryId).then((result) => {
            if (!result) return res.json({ status: 400, error: "Incorrect category id!" });
            result.update(data);
            return res.json(result);
        }).catch((err) => {
            return res.json(err);
        })
    }

    deleteCategory(req, res, next) {
        let categoryId = req.params.id;
        Category.destroy({ where: { id: categoryId } }).then((result) => {
            if (result == 0) return res.json({ status: 400, error: "Incorrect category id!" });
            return res.json(result);
        }).catch((err) => {
            return res.json(err);
        })
    }

    getAll(req, res, next) {
        Category.findAll().then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.json(err);
        });
    }

    getUsersByCategory(req, res, next) {
        let categoryId = req.params.id;

        sequelize.query(DataRepository.getAllUsersByCategory(categoryId),
            { replacements: { category_id: categoryId } }).then((result) => {

                let resArray = result[0];
                let formatResult = [];

                for (let i = 0; i < resArray.length; i++) {

                    let obj = {
                        category_id: resArray[i].category_id,
                        user: {
                            user_id: resArray[i].user_id,
                            name: resArray[i].name,
                            last_name: resArray[i].last_name,
                            email: resArray[i].email,
                            phone_number: resArray[i].phone_number
                        }
                    };

                    formatResult.push(obj);
                }

                return res.json(formatResult);

            }).catch((err) => {
                return res.json(err);
            });

    }

}

module.exports = new CategoryController();