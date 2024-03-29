let mealkitsDB=[
    {
    title: "Veggie pizza",
    includes: "Greek salad",
    description: "roasted red peppers, baby spinach, onions, mushrooms, tomatoes, and black olives.",
    category: "Vegeterian Meals",
    price: 12.99,
    cookingTime: 15,
    servings: 1,
    caloriesPerServing: 700,
    mealKitPic: "pizza-6149630_960_720.jpg",
    topMeal: true
  },

 {
    title: "Real Italian",
    includes: "Italian bread",
    description: "sausages,mushrooms,cheese,green/red pepper",
    category: "Meat Meals",
    price: 20.99,
    cookingTime: 20,
    servings: 1,
    caloriesPerServing: 2110,
    mealKitPic: "pizza-4220756_960_720.jpg",
    topMeal: true

},

{
    title: "Barbecue pizza",
    includes: "Chicken wings",
    description: "Barbecue sauce,cheese,black olives,pieces of veal,sweet corn",
    category: "Meat Meals",
    price: 18.99,
    cookingTime: 25,
    servings: 1,
    caloriesPerServing: 1451,
    mealKitPic: "sauces-2798897_960_720.jpg",
    topMeal: true
},
{
    title: "Mushroom pizza",
    includes: "Greek salad",
    description: "cheese,mushrooms,green onions",
    category: "Vegeterian Meals",
    price: 12.99,
    cookingTime: 10,
    servings: 1,
    caloriesPerServing: 820,
    mealKitPic: "00647564-Whole-Mushroom-Pizza-on-Pie-Plate.jpg",
    topMeal: false
},
{
    title: "Cheese pizza",
    includes: "Greek salad",
    description: "cheese, tomato paste",
    category: "Vegeterian Meals",
    price: 10.99,
    cookingTime: 10,
    servings: 1,
    caloriesPerServing: 400,
    mealKitPic: "pizza-on-brown-wooden-table.jpg",
    topMeal: false
},
{
    title: "Sausage pizza",
    includes: "Chicken wings",
    description: "sausage,cheese,red pepper,yellow pepper,barbecue sauce",
    category: "Meat Meals",
    price: 15.99,
    cookingTime: 15,
    servings: 1,
    caloriesPerServing: 760,
    mealKitPic: "sausage-pepper-personal-pizzas-close-up-hero.jpg",
    topMeal: false
},
{
    title: "Pepperoni pizza",
    includes: "Italian bread",
    description: "pepperoni,tomato paste,mozzarella",
    category: "Meat Meals",
    price: 10.99,
    cookingTime: 10,
    servings: 1,
    caloriesPerServing: 494,
    mealKitPic: "pepperoni-pizza-ck-x.jpg",
    topMeal: false
}];


module.exports.getAllMeals=()=>{
    return mealkitsDB;
}

module.exports.getTopMeals=()=>{
    let topMeals=[];
    for(let i=0;i<mealkitsDB.length;i++){
        if(mealkitsDB[i].topMeal){
            topMeals.push(mealkitsDB[i]);
        }
    }
return topMeals;
}


module.exports.getMealsByCategory=()=>{
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
    for(let i=0;i<mealkitsDB.length;i++){
        if(mealkitsDB[i].category.includes("Meat")){

    mealsByCategory[0].mealKits.push(mealkitsDB[i]);
        }
        else{
    mealsByCategory[1].mealKits.push(mealkitsDB[i]);
        }
    }
    
    return mealsByCategory;
   
}

