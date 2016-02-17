var formatDate = function(entity) {
    entity.createdAt = Math.floor(Date.now() / 1000);
};
module.exports = {
    formatDate: formatDate
};