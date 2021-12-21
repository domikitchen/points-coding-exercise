const db = require('../data/db-config.js');

module.exports = {
    findAllTransactions,
};

function findAllTransactions() {
    return db('transactions');
};