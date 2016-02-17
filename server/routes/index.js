var controllers = require('../controllers');

module.exports = function (app) {

    app.get('/', controllers.static.index);

    app.route('/api/users')
        .post(controllers.users.loginOrCreateNewUser)
        .get(controllers.users.getAll);

    app.route('/api/users/:id')
        .get(controllers.users.getUserById)
        .patch(controllers.users.updateUser);
        //.delete(controllers.users.deleteUser);

    app.route('/api/categories')
        .post(controllers.categories.createCategory)
        .get(controllers.categories.getAll);

    app.route('/api/categories/:id')
        .get(controllers.categories.getCategoryById)
        .patch(controllers.categories.updateCategory);
        //.delete(controllers.categories.deleteCategory);

    app.route('/api/users/:id/categories')
        .post(controllers.users.addCategoriesForUser)
        .get(controllers.users.getCategoriesByUser)
        .patch(controllers.users.deleteCategoriesByUser);

    app.route('/api/categories/:id/users')
        .get(controllers.categories.getUsersByCategory);

    app.route('/api/messages/')
        .post(controllers.messages.sendMessage);

    app.route('/api/messages/:id')
        .get(controllers.messages.getMessageById)
        .delete(controllers.messages.deleteMessage);

    app.route('/api/users/:id/messages/inbox')
        .get(controllers.messages.getAllInboxMessages);

    app.route('/api/users/:id/messages/outbox')
        .get(controllers.messages.getAllOutboxMessages);

    app.route('/api/matches/:userId/accept')
        .post(controllers.users.acceptMatch);

    app.route('/api/matches/count')
        .get(controllers.users.getCountOfMatches);

    app.route('/api/matches/:userId/decline')
        .post(controllers.users.declineMatch);

    app.route('/api/matches/:userId')
        .get(controllers.users.getMatchesByUser)
        .post(controllers.users.getNewCandidate);

    app.route('/api/matches/:id/delete')
        .delete(controllers.users.deleteMatch);

    app.route('/api/neurons/')
        .get(controllers.users.getCountOfNeurons);
};