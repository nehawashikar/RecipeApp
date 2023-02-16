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

const RecipeController = require("./app/controllers/recipe.controller");


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
const Role = db.role;

//resync databse
db.sequelize.sync({ force: process.env.NODE_ENV !== "production" })
  .then(() => {
    console.log("Synced db.");
    initial();
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

//GET route
app.get("/", (req, res) => {
    res.json({message: "Welcome to the recipe application."});
});

//create 3 rows in database
function initial() {
  Role.create({
    id: 1,
    name: "user"
  }).catch(() => console.log("Error initializing user role"));

  Role.create({
    id: 2,
    name: "moderator"
  }).catch(() => console.log("Error initializing moderator role"));

  Role.create({
    id: 3,
    name: "admin"
  }).catch(() => console.log("Error initializing admin role"));

}

//include the routes
require("./app/routes/recipe.routes")(app);
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

//listen for requests on port 8080 for incoming requests 
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
