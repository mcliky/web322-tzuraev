const express = require("express");
const mealkitModel = require("../models/mealkitsmodel");
const router = express.Router();


router.post("/updateMealkit", (req, res) => {
    let isValid = true;
    let validationMessages = {};
    const {searchTitle,title, includes, description, category} = req.body;
    let price = parseFloat(req.body.price);
    let cookingTime = parseFloat(req.body.cookingTime);
    let servings = parseFloat(req.body.servings);
    let caloriesPerServing = parseFloat(req.body.caloriesPerServing);
    let isTopMeal = req.body.isTopMeal == "true";
    console.log("Start");
    if(typeof searchTitle !== "string" || searchTitle.trim().length === 0){
     validationMessages.searchTitle = "Please enter a title that exists in database"
     console.log("Please enter a title that exists in database");
    }
    else if (typeof title !== "string" || title.trim().length === 0) {
      isValid = false;
      validationMessages.title = "Title is not valid";
    }
    else if (typeof includes !== "string" || includes.trim().length === 0) {
      isValid = false;
      validationMessages.includes = "What is included with the mealkit?";

    } 
    else if (typeof description !== "string" || description.trim().length === 0) {
      isValid = false;
      validationMessages.description = "Meal kit description is not valid";
    } 
    else if (typeof category !== "string" || category.trim().length === 0) {
        isValid = false;
        validationMessages.category = "Category is not valid";
    } 
    else if (isNaN(price) || price < 0) {
        isValid = false;
        validationMessages.price = "Price is not valid";
    } 
    else if (isNaN(cookingTime) || cookingTime < 0) {
        isValid = false;
        validationMessages.cookingTime = "Cooking time is not valid";
    }
      
    else if (isNaN(servings) || servings < 0) {
        isValid = false;
        validationMessages.servings = "Servings are not valid";
  
    }
      
    else if (isNaN(caloriesPerServing) || caloriesPerServing < 0) {
        isValid = false;
        validationMessages.caloriesPerServing = "Calories are not valid";
    }
  
    if (isValid) {
   console.log(req.body.searchTitle);
        mealkitModel.updateOne({
          searchTitle: req.body.searchTitle
      },{$set:{
        title: title,
        includes: includes,
        description:description,
        category: category,
        price: price,
        cookingTime: cookingTime,
        servings: servings,
        caloriesPerServing: caloriesPerServing,
        topMeal: isTopMeal
      }
      })  
      .exec()
      .then(() => {
          console.log("Successfully update the name for " + req.body.searchTitle);
  
          // Redirect to home page.
          res.redirect("/clerkDashboard");
      });
  
      console.log(validationMessages);
      console.log("error");
  }
  else{
    res.render("general/updateMealkit", {
        title: "Update",
        values:req.body,
        validationMessages
      });
  }
  
  });





module.exports = router;