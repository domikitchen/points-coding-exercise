
exports.up = function(knex) {
    return knex.schema
        .createTable('transaction', function (table) {
            table.increments('transaction_id');
            table.string('payer');
            table.integer('points');
            table.timestamp('timestamp');
        });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('transaction');
};
