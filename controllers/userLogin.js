const express = require("express");
const userModel = require("../models/userInfo");
const router = express.Router();
const bcrypt = require("bcryptjs");


router.get("/clerkDashboard",function(req,res){
  res.render("general/clerkDashboard",{
    title: "clerkDashboard",
  })
})
router.get("/login", function (req, res) {
  res.render("general/login", {
    title: "Login"
  });
});

router.post("/login", (req, res) => {
  let errors = [];
  let isValid = true;
  let validationMessages = {};
  const { email, password, isClerk } = req.body;

  if (email.trim().length === 0 || email === null) {
    isValid = false;
    validationMessages.email = "Email is not valid";
  } else if (password.length === 0 || password === 0) {
    isValid = false;
    validationMessages.password = "Password is not valid";
  }

  if (isValid) {
    userModel
      .findOne({
        email: req.body.email
      })
      .then((user) => {
        // Completed the search.
        if (user) {
          // Found the user document.
          // Compare the password supplied by the user with the one in our document.
          bcrypt.compare(req.body.password, user.password).then((isMatched) => {
            // Done comparing the password.

            if (isMatched&&!isClerk) {
              // Passwords match.
              // Create a new session by storing the user document (object) to the session.
              req.session.user = user;
              res.redirect("/");
            }
            else if(isMatched&&isClerk){
              req.session.isClerk = true
              req.session.user = user;
              res.redirect("/clerkDashboard");
            } 
            else {
              // Passwords are different.
              console.log("Passwords do not match.");
              errors.push("Sorry, your password does not match our database.");

              res.render("general/login", {
                errors
              });
            }
          });
        } else {
          // User was not found in the collection.
          console.log("User not found in the database.");
          errors.push("Email was not found in the database.");

          res.render("general/login", {
            errors
          });
        }
      })
      .catch((err) => {
        // Couldn't query the database.
        console.log(`Error finding the user in the database ... ${err}`);
        errors.push("Oops, something went wrong.");

        res.render("general/login", {
          errors
        });
      });
  } else {
    res.render("general/login", {
      title: "Login",
      values: req.body,
      validationMessages
    });
  }
});

router.get("/logout", (req, res) => {
  // Clear the session from memory.
  req.session.destroy();

  res.redirect("/login");
});

module.exports = router;
