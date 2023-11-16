const {PetModel, petSchema} = require('./pet.model');
const {UserModel, userSchema} = require('./user.model');

function setUpModels(sequelize){
    PetModel.init(petSchema, PetModel.config(sequelize));
    UserModel.init(userSchema, UserModel.config(sequelize));
}

module.exports = setUpModels;