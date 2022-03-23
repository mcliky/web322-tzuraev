var express = require("express");
const exphbs= require('express-handlebars');
var path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");

const dotenv = require('dotenv');
dotenv.config({ path: "./config/keys.env"});

var app = express();

app.engine('.hbs', exphbs({
  extname: '.hbs',
  defaultLayout: 'main'
}));


app.set('view engine', '.hbs');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

app.use((req, res , next) => {
res.locals.user = req.session.user;
res.locals.isClerk = req.session.isClerk;
next();
});

app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_DB_CONN_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(()=>{
  console.log("Connected to the MongoDB database.");
})
.catch((err)=>{
  console.log(`There was a problem connect to MongoDB ... ${err}`);
})


app.use(express.static(__dirname + "/public"));


const generalController = require("./controllers/general.js");
const mealKitsController = require("./controllers/mealKits");
const registrationController = require("./controllers/userRegistration");
const loginController = require("./controllers/userLogin");

app.use("/",mealKitsController);
app.use("/", generalController);
app.use("/",registrationController);
app.use("/",loginController);


var HTTP_PORT = process.env.PORT || 8080;



// setup a 'route' to listen on the default url path (http://localhost)


// setup another route to listen on /about




// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);

