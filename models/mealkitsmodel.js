const mongoose = require("mongoose");

const mealkitsSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    includes: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true
    },
    cookingTime: {
      type: Number,
      required: true
    },
    servings: {
      type: Number,
      required: true
    },
    caloriesPerServing: {
      type: Number,
      required: true
    },
    
    mealKitPic: String,
    dateCreated: {
      type: Date,
      default: Date.now()
    },

    topMeal: {
        type: Boolean,
        required: true
    }
  });



const mealkitsModel = mongoose.model("mealkits", mealkitsSchema);

module.exports = mealkitsModel;