// exports configuring parameters for MySQL connection and Sequelize
module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "password",
    DB: "bookapp",
    dialect: "mysql",
    pool: {
        //max number of connections in the pool
        max: 5,
        //min number of connections in the pool
        min: 0,
        //max time (millisecs) that pool will try to get a connection before throwing an error
        acquire: 30000,
        //max time (millisecs) that connection can be inactive/idle before being released
        idle: 1000
    }
};