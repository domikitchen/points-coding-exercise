
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('transaction').del()
    .then(function () {
      // Inserts seed entries
      return knex('transaction').insert([
        {transaction_id: "1", payer: "DANNON", points: 1000, timestamp: "2020-11-02T14:00:00Z"},
        {transaction_id: "2", payer: "UNILEVER", points: 200, timestamp: "2020-10-31T11:00:00Z"},
        {transaction_id: "3", payer: "DANNON", points: -200, timestamp: "2020-10-31T15:00:00Z"},
        {transaction_id: "4", payer: "MILLER COORS", points: 10000, timestamp: "2020-11-01T14:00:00Z"},
        {transaction_id: "5", payer: "DANNON", points: 300, timestamp: "2020-10-31T10:00:00Z"},
      ]);
    });
};
