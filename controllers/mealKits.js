const express = require('express');
const router = express.Router();
const mealkits=require("../models/mealkits")


router.get("/onthemenu", function(req,res){
    res.render("general/onthemenu",{
      mealsByCategory: mealkits.getMealsByCategory(),
    });
  });

  router.get("/", function(req,res){
    res.render("general/index",{
      mealkits: mealkits.getTopMeals(),
    });
  });



module.exports=router;