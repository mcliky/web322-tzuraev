const express = require("express");
const mealkitModel = require("../models/mealkitsmodel");
const router = express.Router();
const mealkitsDB = require("../models/mealkit-db");


router.get("/load-data/meal-kits",function (req,res){
   if(req.session && req.session.user && req.session.isClerk){
mealkitModel.find().count({},(err, count)=>{
   if (err){
      res.send("Couldn`t count the documents: " + err);
   }
   else if(count === 0) {
mealkitModel.collection.insertMany(mealkitsDB.getAllMeals(), (err, docs)=>{
   if (err){
      router.get("/messageError",function(req,res){
         res.render("general/messageError",{
           title: "Error!",
         })
       })
       res.redirect("/messageError");
   }
   else{
      router.get("/messageSuccess",function(req,res){
         res.render("general/messageSuccess",{
           title: "Success!",
         })
       })
       res.redirect("/messageSuccess");
   }
});
   }
   else{
      router.get("/messageAlreadyLoaded",function(req,res){
         res.render("general/messageAlreadyLoaded",{
           title: "Error!",
         })
       })
       res.redirect("/messageAlreadyLoaded");
   }
});
   }
   else{
      router.get("/messageNotAuthorized",function(req,res){
         res.render("general/messageNotAuthorized",{
           title: "Error!",
         })
       })
       res.redirect("/messageNotAuthorized");
   }
})









module.exports = router;