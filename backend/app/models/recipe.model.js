//create Sequelize data model
module.exports = (sequelize, Sequelize) => {
    //columns in recipes table 
    const Recipe = sequelize.define("recipe", {
        title: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        },
        published: {
            type: Sequelize.BOOLEAN
        }
    });
    
    return Recipe;
};