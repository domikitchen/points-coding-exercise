const express = require('express');
const db = require('./data/db-config.js');

const server = express();
const apiRouter = require('./api/api-router.js');

server.get('/', (request, response) => {
    response.send('please visit the read me to traverse the api')
})

server.get('/reset', (request, response) => {

    // deletes all current data
    db('transaction').del()
        .then(res => {
            if(res) {
                
                // inserts seed data
                db('transaction').insert([
                    {transaction_id: "1", payer: "DANNON", points: 1000, timestamp: "2020-11-02T14:00:00Z"},
                    {transaction_id: "2", payer: "UNILEVER", points: 200, timestamp: "2020-10-31T11:00:00Z"},
                    {transaction_id: "3", payer: "DANNON", points: -200, timestamp: "2020-10-31T15:00:00Z"},
                    {transaction_id: "4", payer: "MILLER COORS", points: 10000, timestamp: "2020-11-01T14:00:00Z"},
                    {transaction_id: "5", payer: "DANNON", points: 300, timestamp: "2020-10-31T10:00:00Z"},
                  ]).then(r => {
                      if(res) {
                          response.send('database reset');
                      };
                  });
            };
        });
});

server.use(express.json());
server.use('/api', apiRouter);

module.exports = server;