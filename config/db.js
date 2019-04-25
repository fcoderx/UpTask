const Sequelize = require('sequelize');
const db = new Sequelize('uptasknode', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    port: 8889,
    opetatorsAliases: false,
    define: {
        timestamps: false
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = db;