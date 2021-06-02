const Sequelize = require("sequelize");
// const env = process.env.NODE_ENV || 'development';
const config = {
  username: "W9eklyHK2f",
  password: "29KQDGRokR",
  database: "W9eklyHK2f",
  host: "remotemysql.com",
  dialect: "mysql",
  port: "3306",
};
// var sequelize = new Sequelize(config.database, config.username, config.password,config);

var sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    port: config.port,
    host: config.host,
    dialect: "mysql",
  }
);
// if (config.use_env_variable) {
//   var sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   var sequelize = new Sequelize(config.database, config.username, config.password,config);
// }

module.exports = sequelize;
