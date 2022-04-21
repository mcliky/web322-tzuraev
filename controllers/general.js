const express = require("express");
const router = express.Router();
const mealkitsModel = require("../models/mealkitsmodel");








const prepareViewModel = function (req, message) {

  if (req.session && req.session.user) {
      // A session was established and the user is signed in.

      let cart = req.session.cart || [];
      let cartTotalMoney = 0;

      // Check if the cart has any meals.
      const hasMeals = cart.length > 0;

      console.log("in prepareViewModel, cart.length=",cart.length);
      // If there are meals in the shopping cart, then calculate the order total.
      if (hasMeals) {
          cart.forEach(cartMeal => {
              console.log(`${cartTotalMoney} += ${cartMeal.data.price} * ${cartMeal.qty};`)
              cartTotalMoney += cartMeal.data.price * cartMeal.qty;
          });
      }
      console.log("cartTotalMoney=",cartTotalMoney);

      let resultantDataModel = {
          hasMeals,
          cartTotal: "$" + cartTotalMoney.toFixed(2),
          meals: cart,
          message
      };
	  console.log("resultantDataModel=",resultantDataModel);
	  return resultantDataModel;
  }
  else {
      // User is not signed in, return default information.
      return {
          hasMeals: false,
          cartTotal: "$0.00",
          meals: [],
          message
      };
  }
}

router.get("/shoppingCart", function (req, res) {
  if(req.session.user){
    let message= 'message';
    res.render('general/shoppingCart', prepareViewModel(req, message));
}
else{
  router.get("/messageNotAuthorized",function(req,res){
    res.render("general/messageNotAuthorized",{
      title: "Error!",
    })
  })
  res.redirect("/messageNotAuthorized");
}
});


router.get("/add-meal/:id", async function(req, res){

  console.log("constructing /add-meal/:id");
  let message;
  const mealId = req.params.id;
  if(mealId.startsWith('item-')){ return null; }

  if (req.session.user) {
      // The user is signed in.

      // A shopping cart item will look like this:
      //    id: ID of the meal.
      //    qty: Number of purchases for this meal.
      //    meal: The details about the meal (for displaying in cart).

      // Find the meal in the "fake" database.
      console.log("mealId=", mealId);
      
      
    mealkitsModel.find({_id: mealId}).exec()
    .then(data => {

  
      data = data.map(value => value.toObject())[0];
  
    
   

	  // console.log("found data=", data);
	  // console.log("found data.id=", data._id);
	  // console.log("found data.mealKitPic=", data.mealKitPic);
  
      let cart = req.session.cart = req.session.cart || [];
      //if(!global.hasOwnProperty('cartQQ')){ global.cartQQ = []; }
      //let cart = global.cartQQ;
	  
      if (data) {
          // meal was found in the database.
          // Search the shopping cart to see if the meal is already added.
          let found = false;

          cart.forEach(cartMeal => {
              if (cartMeal.id == mealId) {
                  // meal was already in the shopping cart, increment the quantity.
                  found = true;
                  cartMeal.qty++;
                  cartMeal.quantityPrice = cartMeal.individualPrice * cartMeal.qty;
              }
              
          });
          req.session.save();

          if (found) {
              message = "Meal was already in the cart, incremented the quantity by one.";
          }
          else {
              // meal was not found in the shopping cart. Create a new shopping cart object
              // and add it to the cart.
              console.log(`adding new pizza ${mealId}`);
              cart.push({
                  id: mealId,
                  qty: 1,
                  individualPrice: data.price,
                  quantityPrice: data.price,
                  data
              });
              req.session.cart = cart;
              console.log("This is cart = " , cart);
              console.log(`cart.length = ${cart.length}`);
              // Logic to sort the cart by meal title.
              cart.sort((a, b) => a.data.title.localeCompare(b.data.title));
              req.session.save();
              message = "Meal added to the shopping cart."
              console.log("Meal added to the shopping cart.");
          }
      }
      else {
          // meal was not found in the database.
          message = "Meal was not found in the database."
          console.log("Meal was not found in the database.");
      }
    })
  }
  else {
      // The user is not signed in.
      router.get("/messageNotAuthorized",function(req,res){
        res.render("general/messageNotAuthorized",{
          title: "Error!",
        })
      })
      res.redirect("/messageNotAuthorized");
  }

  //res.render('general/shoppingCart', prepareViewModel(req, message));
  res.redirect('/shoppingCart');
  console.log("finished making /add-meal/");
});


router.get("/remove-meal/:id", (req, res) => {

  let message;
  const mealId = req.params.id;

  if (req.session.user) {
      // The user is signed in.

      let cart = req.session.cart || [];

      // Find the meal in the shopping cart.
      const index = cart.findIndex(cartMeal => cartMeal.id == mealId);

      if (index >= 0) {
          // meal was found in the shopping cart.
          message = `Removed "${cart[index].data.name}" from the cart`;
          cart.splice(index, 1);
          req.session.save();
      }
      else {
          // meal was not found, nothing to do.
          message = "Meal was not found in your cart."
      }
  }
  else {
      // The user is not signed in.
      router.get("/messageNotAuthorized",function(req,res){
        res.render("general/messageNotAuthorized",{
          title: "Error!",
        })
      })
      res.redirect("/messageNotAuthorized");
  }

  res.redirect('/shoppingCart');
});

router.get("/check-out", (req, res) => {

  let message;

  if (req.session.user) {
      let cart = req.session.cart || [];

      if (cart.length > 0) {
        const sgMail = require("@sendgrid/mail");
        sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
    
        const msg = {
          to: `${email}`,
          from: "tzuraev@myseneca.ca",
          subject: "Contact Us Form Submission",
          html: `Thank you for purchase ${firstName} ${lastName}!<br>
          ----------------------------<br>
          TOMAS ZURAEV WEB322
          `
        };
        sgMail
      .send(msg)
          // There are items in the cart, check-out the user.
          message = "Thank you for your purchase, you are now checked out.";

          req.session.cart = [];
          res.redirect('general/shoppingCart');
      }
      else {
          // There are no items in the cart.
          message = "You cannot check-out, there are no items in the cart.";
          res.redirect('general/shoppingCart');
      }
  }
  else {
      // The user is not signed in.
      router.get("/messageNotAuthorized",function(req,res){
        res.render("general/messageNotAuthorized",{
          title: "Error!",
        })
      })
      res.redirect("/messageNotAuthorized");
  }

  // Render the view
  res.redirect('general/shoppingCart');

});























module.exports = router;
