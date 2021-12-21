
exports.up = function(knex) {
    return knex.schema
        .createTable('transaction', function (table) {
            table.string('transaction_id');
            table.string('user_id');
            table.integer('points');
            table.timestamp('timestamp');
        });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('transaction');
};
