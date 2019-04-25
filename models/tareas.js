const Sequelize = require('sequelize');
const db = require('../config/db');
// Importar modelo anterior para hacer relación con ambos 
const Proyectos = require('./Proyectos');

const Tareas = db.define('tareas', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    tarea: Sequelize.STRING(100),
    estado: Sequelize.INTEGER(1)
});
Tareas.belongsTo(Proyectos);

module.exports = Tareas;