const express = require('express');

const server = express();

server.get('/', (request, response) => {
    response.send('hi')
})

server.use(express.json());

module.exports = server;