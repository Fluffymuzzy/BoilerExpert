const mySql = require("mysql");

const conn = mySql.createConnection({
    host: "localhost",
    user: "sqluser",
    password: "password",
    database: "data_base",
  });

module.exports = conn;