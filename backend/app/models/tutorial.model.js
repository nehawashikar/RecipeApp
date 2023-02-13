//create Sequelize data model
module.exports = (sequelize, Sequelize) => {
    //columns in tutorials table 
    const Tutorial = sequelize.define("tutorial", {
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
    
    return Tutorial;
};