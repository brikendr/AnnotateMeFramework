//  config.js
//
//  Simple application configuration. Extend as needed.
module.exports = {  
    port: process.env.PORT || 8123,
  db: {
    host: process.env.DATABASE_HOST || '0.0.0.0',
    database: 'AnnotateMe2',
    username: 'root',
    password: '112233AABBCC',
    port: 3306,
    dialect: "mysql"
  }
};