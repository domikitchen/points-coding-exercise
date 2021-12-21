
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('transaction').del()
    .then(function () {
      // Inserts seed entries
      return knex('transaction').insert([
        {transaction_id: "testId1", user_id: "userId1", points: 1000, timestamp: "2020-11-02T14:00:00Z"},
        {transaction_id: "testId2", user_id: "userId2", points: 200, timestamp: "2020-10-31T11:00:00Z"},
        {transaction_id: "testId3", user_id: "userId1", points: -200, timestamp: "2020-10-31T15:00:00Z"},
        {transaction_id: "testId4", user_id: "userId3", points: 10000, timestamp: "2020-11-01T14:00:00Z"},
        {transaction_id: "testId5", user_id: "userId1", points: 300, timestamp: "2020-10-31T10:00:00Z"},
      ]);
    });
};
