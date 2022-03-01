const express = require('express');
const router = express.Router();
const mealkits=require("../models/mealkits")


router.get("/userWelcome",function(req,res){
  res.render("general/userWelcome",{
    title: "Welcome!"
  })
})

router.get("/sign-up",function(req,res){
    res.render("general/sign-up",{
      title: "Sign up"
    })
})



router.post("/sign-up",(req,res)=>
{
  isPasswordValid=(pass)=>{
    // regularExpressions = (/.*[a-z].*/)(/.*[A-Z].*/)(/.*\d.*/)(/.*\d.*/);
    if(pass.match(/.*[a-z].*/) && pass.match(/.*[A-Z].*/) && pass.match(/.*\d.*/) && pass.match(/.*\W.*/)){
      return true;
    }
  }

  let isValid = true;
  let validationMessages = {};
  const { firstName,lastName, username, email, password } = req.body;
  if(typeof firstName!=='string'||firstName.trim().length === 0){
    isValid=false;
    validationMessages.firstName = "First name is not valid";
  }
  else if(typeof lastName!=='string'||lastName.trim().length === 0){
    isValid=false;
    validationMessages.lastName = "Last name is not valid"
  }
  else if(typeof username!=='string'||username.trim().length === 0){
    isValid=false;
    validationMessages.username = "Username is not valid"
  }
  else if ( email.trim().length === 0 || email===null){
    isValid=false;
    validationMessages.email = "Email is not valid";
  }
else if(password.length < 8 || password.length > 12){
isValid=false;
validationMessages.password = "Password must be between 8 to 12 characters";
}
else if(!isPasswordValid(password)){
isValid=false;
validationMessages.password = "Password must contain at least one lowercase letter, uppercase letter, number and a symbol";
}
  if(isValid){
    const sgMail = require("@sendgrid/mail");
    sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
    
    const msg = {
      to: `${email}`,
      from: "tzuraev@myseneca.ca",
      subject: "Contact Us Form Submission",
      html:
      `Welcome to the website ${firstName} ${lastName}!<br>
      ----------------------------<br>
      TOMAS ZURAEV WEB322
      `
    };
    
    sgMail.send(msg)
    .then(()=>{
      res.render("general/userWelcome",{
        title: "Welcome!",
        values: req.body,
        validationMessages
      })
    })
    .catch(err => {
      console.log(`Error ${err}`);

      res.render("general/sign-up",{
        title: "Sign up",
        values: req.body,
        validationMessages
      });
    });

  }

  else{
    
      res.render("general/sign-up",{
        title: "Sign up",
        values: req.body,
        validationMessages
      });
  }
  
});

router.get("/login",function(req,res){
  res.render("general/login",{
    title: "Login"
  })
})

router.post("/login",(req,res)=>
{
  let isValid = true;
  let validationMessages = {};
  const { email, password } = req.body;
  if ( email.trim().length === 0 || email===null){
    isValid=false;
    validationMessages.email = "Email is not valid";
  }
else if(password.length ===0 || password === 0){
isValid=false;
validationMessages.password = "Password is not valid";
}
  if(isValid){
    res.render("general/userWelcome",{
      title: "Welcome!"
    })
  }
  else{
    
      res.render("general/login",{
        title: "Login",
        values: req.body,
        validationMessages
      });
  }
  
});

router.get("/onthemenu", function(req,res){
  res.render("general/onthemenu",{
    mealsByCategory: mealkits.getMealsByCategory(),
  });
});



  module.exports=router;