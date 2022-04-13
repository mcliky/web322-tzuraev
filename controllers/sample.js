const express = require("express");
const mealkitModel = require("../models/mealkitsmodel");
const router = express.Router();
const path = require('path');


router.post("/deleteMealkits", (req, res) => {
  let isValid = true;
  let validationMessages = {};
  const { title } = req.body;
 
  if (typeof title !== "string" || title.trim().length === 0) {
    isValid = false;
    validationMessages.firstName = "Title is not valid";
  } 
  if (isValid) {
    mealkitModel.deleteOne({
      title
  })
  .exec()
  .then(() => {
      console.log("Successfully deleted the name for " + req.body.title);

      // Redirect to home page.
      res.redirect("/clerkDashboard");
  });
  }
  else {
      res.render("general/deleteMealkits", {
          title: "Delete",
          values:req.body,
          validationMessages
        });
    }
});







router.post("/createMealkit", (req, res) => {
  let isValid = true;
  let validationMessages = {};
  const { title, includes, description, category, mealKitPic} = req.body;
  let price = parseFloat(req.body.price);
  let cookingTime = parseFloat(req.body.cookingTime);
  let servings = parseFloat(req.body.servings);
  let caloriesPerServing = parseFloat(req.body.caloriesPerServing);
  let isTopMeal = req.body.isTopMeal == "true";

  if (typeof title !== "string" || title.trim().length === 0) {
    isValid = false;
    validationMessages.firstName = "Title is not valid";
  } else if (typeof includes !== "string" || includes.trim().length === 0) {
    isValid = false;
    validationMessages.includes = "What is included with the mealkit?";
  } else if (typeof description !== "string" || description.trim().length === 0) {
    isValid = false;
    validationMessages.description = "Meal kit description is not valid";
  } else if (typeof category !== "string" || category.trim().length === 0) {
      isValid = false;
      validationMessages.category = "Category is not valid";
  } else if (isNaN(price) || price < 0) {
      isValid = false;
      validationMessages.price = "Price is not valid";
  } else if (isNaN(cookingTime) || cookingTime < 0) {
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
    const mealkit = new mealkitModel({
      title: title,
      includes: includes,
      description: description,
      category: category,
      price: price,
      cookingTime: cookingTime,
      servings: servings,
      caloriesPerServing: caloriesPerServing,
      mealKitPic: mealKitPic,
      topMeal: isTopMeal
    });
      mealkit.save()
      .then((mealkitSaved) => {
          // mealkit was saved correctly.
          console.log(`Mealkit ${mealkitSaved.title} has been added to the database.`);
          console.log(`req.files = "${req.files}"`);
          // Create a unique name for the image, so that it can be saved in the file system.
          let uniqueName = `mealkit-pic-${mealkitSaved._id}${path.parse(req.files.mealKitPic.name).ext}`;
          
          // Copy the image data to a file in the "public/image" folder.
          console.log(`moving file from ${req.files.mealKitPic} to public/image/${uniqueName}`);
          req.files.mealKitPic.mv(`public/image/${uniqueName}`)
          
          .then(() => {
            
              // Update the mealkit document so that it includes the image URL.
              mealkitModel.updateOne({
                  _id: mealkitSaved._id
              }, {
                  mealKitPic: uniqueName
              })
              .then(() => {
                  console.log("Meal kit document was updated with the picture.");
                  res.redirect("/clerkDashboard");

              })
              .catch(err => {
                  console.log(`Error updating the meal kit's picture ... ${err}`);
                  res.redirect("/clerkDashboard");
              })
          });
      })
      .catch((err) => {
          console.log(`Error adding mealkit to the database ... ${err}`);
          res.redirect("/clerkDashboard");
      });
  }
  else {
      res.render("general/createMealkit", {
          title: "Create",
          values:req.body,
          validationMessages
        });
    }
});







module.exports = router;