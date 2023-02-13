//Express web server
//configure cross-origin resource sharing (CORS)
//initialize and run REST APIs
//Express: building REST APIs
//cors: porvides Express middleware to enable CORS

//import express and cors modules
const express = require("express");
//const bodyParser = require("body-parser");
const cors = require("cors");

//create an express app
const app = express();

//set the origin
var corsOptions = {
    origin: "http://localhost:8081"
};

//set up CORS middleware
app.use(cors(corsOptions));

//parse application/json format request
app.use(express.json());

//parse application/x-www-form-urlencoded format requests
app.use(express.urlencoded({extended: true}));


const db = require("./app/models");

//resync databse
db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

//GET route
app.get("/", (req, res) => {
    res.json({message: "Welcome to the book application."});
});

//include the routes
require("./app/routes/tutorial.routes")(app);

//listen for requests on port 8080 for incoming requests 
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});