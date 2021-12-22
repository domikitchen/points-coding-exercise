require('dotenv').config();
const knex = require('knex');

// sets the knex
// normally would have a conditional for a prodction
const knexConfig = require('../knexfile.js')['development']

module.exports = knex(knexConfig);