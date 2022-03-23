const express = require("express");
const userModel = require("../models/userInfo");
const router = express.Router();



router.get("/sign-up", function (req, res) {
  res.render("general/sign-up", {
    title: "Sign up"
  });
});

router.post("/sign-up", (req, res) => {
  isPasswordValid = (pass) => {
    // regularExpressions = (/.*[a-z].*/)(/.*[A-Z].*/)(/.*\d.*/)(/.*\d.*/);
    if (
      pass.match(/.*[a-z].*/) &&
      pass.match(/.*[A-Z].*/) &&
      pass.match(/.*\d.*/) &&
      pass.match(/.*\W.*/)
    ) {
      return true;
    }
  };

  let isValid = true;
  let validationMessages = {};
  const user = new userModel({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });
  const { firstName, lastName, username, email, password } = req.body;
  if (typeof firstName !== "string" || firstName.trim().length === 0) {
    isValid = false;
    validationMessages.firstName = "First name is not valid";
  } else if (typeof lastName !== "string" || lastName.trim().length === 0) {
    isValid = false;
    validationMessages.lastName = "Last name is not valid";
  } else if (typeof username !== "string" || username.trim().length === 0) {
    isValid = false;
    validationMessages.username = "Username is not valid";
  } else if (email.trim().length === 0 || email === null) {
    isValid = false;
    validationMessages.email = "Email is not valid";
  } else if (password.length < 8 || password.length > 12) {
    isValid = false;
    validationMessages.password = "Password must be between 8 to 12 characters";
  } else if (!isPasswordValid(password)) {
    isValid = false;
    validationMessages.password =
      "Password must contain at least one lowercase letter, uppercase letter, number and a symbol";
  }
  if (isValid) {
    const sgMail = require("@sendgrid/mail");
    sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

    const msg = {
      to: `${email}`,
      from: "tzuraev@myseneca.ca",
      subject: "Contact Us Form Submission",
      html: `Welcome to the website ${firstName} ${lastName}!<br>
      ----------------------------<br>
      TOMAS ZURAEV WEB322
      `
    };

    sgMail
      .send(msg)
      .then(() => {
        user.save().then((userSaved) => {
          console.log(
            `User ${userSaved.firstName} has been added to the database.`
          );
          res.redirect("/login");
        });
      })
      .catch((err) => {
        console.log(`Error ${err}`);
        console.log(`Error adding user to the database ... ${err}`);
        res.render("general/sign-up", {
          title: "Sign up",
          values: req.body,
          validationMessages
        });
      });
  } else {
    res.render("general/sign-up", {
      title: "Sign up",
      values: req.body,
      validationMessages
    });
  }
});



module.exports = router;