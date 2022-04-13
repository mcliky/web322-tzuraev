const express = require("express");
const router = express.Router();
const mealkitsModel = require("../models/mealkitsmodel");


router.get("/onthemenu", function (req, res) {


mealkitsModel.find({},(error,data)=>{
  if(error){
    console.log(error);
  }
  else{
  var allMealkits=JSON.parse(JSON.stringify(data));


  getMealsByCategory=()=>{
    let mealsByCategory=[{
        categoryName: "Meat meals",
        meatMeals:true,
        mealKits:[]
    },
    {
        categoryName:"Vegan meals",
        veganMeals:true,
        mealKits:[]
    }];
    for(let i=0;i<allMealkits.length;i++){
        if(allMealkits[i].category.includes("Meat")){

    mealsByCategory[0].mealKits.push(allMealkits[i]);
        }
        else{
    mealsByCategory[1].mealKits.push(allMealkits[i]);
        }
    }
    
    return mealsByCategory;
   
}
    res.render("general/onthemenu",{
    mealsByCategory:getMealsByCategory(),
    title: "On the menu"
    })
  }
})
});

router.get("/", function (req, res) {
  mealkitsModel.find({topMeal: true},(error,data)=>{
    if(error){
      console.log(error);
    }
    else{
      res.render("general/index",{
      mealkits:JSON.parse(JSON.stringify(data)),
      title: "Home"
      })
    }
  })
});


 
module.exports = router;