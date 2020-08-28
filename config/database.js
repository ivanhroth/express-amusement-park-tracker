const { db } = require('./index');
const { username, password, database, host } = db;

module.exports = {
  development: {
    username,
    password,
    database,
    host,
    dialect: 'postgres'
  }
};
