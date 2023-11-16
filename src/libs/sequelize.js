const {Sequelize} = require('sequelize');
const setUpModels = require('../../db/models');

const sequelize = new Sequelize('pets', 'postgres', 'admin', {
    host: 'localhost',
    dialect: 'postgres',
    logging: true
});

setUpModels(sequelize);

//Sincronizar. OJO CON ENTORNOS PRODUCTIVOS
sequelize.sync();

module.exports = sequelize;