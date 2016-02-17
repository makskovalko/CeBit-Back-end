'use strict';

class DataRepository {

    getAllCategoriesByUser(userId) {
        return "SELECT user_categories.user_id, user_categories.category_id, categories.name FROM user_categories " +
        "INNER JOIN categories " +
        "ON user_categories.category_id = categories.id " +
        "WHERE user_categories.user_id = :user_id";
    }

    getAllUsersByCategory(categoryId) {
        return "SELECT user_categories.user_id, users.name, users.last_name, users.email, users.phone_number, user_categories.category_id " +
            "FROM user_categories " +
            "INNER JOIN users " +
            "ON user_categories.user_id = users.id " +
            "WHERE user_categories.category_id = :category_id";
    }

    getAllCandidatesByCategory(userId, catStr) {
        return "SELECT DISTINCT u.id, u.name, u.last_name, u.middle_name, u.country, u.place_of_work, u.position, u.email" +
            " FROM users u INNER JOIN user_categories uc ON u.id = uc.user_id" +
            " WHERE uc.user_id <> " + userId + " AND category_id IN " + catStr +
            " AND uc.user_id NOT IN (SELECT sender_id FROM matches WHERE recipient_id = " + userId + ") " +
            " AND uc.user_id NOT IN (SELECT recipient_id FROM matches WHERE sender_id = " + userId + ")";
    }

    getAllCandidates(userId) {
        return "SELECT DISTINCT u.id, u.name, u.last_name, u.middle_name, u.country, u.place_of_work, u.position, u.email" +
            " FROM users u" +
            " WHERE u.id <> " + userId +
            " AND u.id NOT IN (SELECT sender_id FROM matches WHERE recipient_id = " + userId + ") " +
            " AND u.id NOT IN (SELECT recipient_id FROM matches WHERE sender_id = " + userId + ")";
    }

}

module.exports = new DataRepository();