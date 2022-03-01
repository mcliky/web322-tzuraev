var express = require("express");
const exphbs= require('express-handlebars');
var path = require("path");



const dotenv = require('dotenv');
dotenv.config({ path: "./config/keys.env"});

var app = express();

app.engine('.hbs',exphbs.engine({
  extname: '.hbs' ,
  defaultLayout: "main"
}));


app.set('view engine', '.hbs');

app.use(express.urlencoded({ extended: false }));

app.use(express.static(__dirname + "/public"));


const generalController = require("./controllers/general");
const mealKitsController = require("./controllers/mealKits")

app.use("/",mealKitsController);
app.use("/", generalController);


var HTTP_PORT = process.env.PORT || 8080;



// setup a 'route' to listen on the default url path (http://localhost)


// setup another route to listen on /about




// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);

