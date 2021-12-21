require('dotenv').config();
const knex = require('knex');

const knexConfig = require('../knexfile.js')[process.env.KNEX_ENV || 'development']

module.exports = knex(knexConfig);