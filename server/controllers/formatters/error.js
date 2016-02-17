'use strict';

class error {
    constructor(status, message) {
        this.status = status;
        this.message = message;
    }

    toJSON() {
        var obj = {
            status: this.status,
            message: this.message
        };
        return obj;
    }
}

module.exports = error;