const { DB } = require("./db");
const { migrate } = require("./migrations");

module.exports = { DB, migrate };