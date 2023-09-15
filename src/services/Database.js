const mongoose = require('mongoose');

class Database {
    constructor(dataURL) {
        this.dataURL = dataURL;
    }

    _connect(dataURL) {
        mongoose.set('strictQuery', false);
        mongoose.connect(dataURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => {
            console.log('[Database] Database is successfully connected.');
        })
        .catch((error) => {
            console.error('[Database] Database connection error: ', error);
        });
    }
}

module.exports = new Database();