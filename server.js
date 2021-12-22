const express = require('express');

const server = express();
const apiRouter = require('./api/api-router.js');

server.get('/', (request, response) => {
    response.send('please visit the read me to traverse the api')
})

server.use(express.json());
server.use('/api', apiRouter);

module.exports = server;