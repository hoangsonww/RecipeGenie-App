db.createCollection("users");
db.createCollection("recipes");
db.createCollection("favorites");
db.createCollection("cookingTips");
db.createCollection("seasonalIngredients");
db.createCollection("nutritionalTips");
db.createCollection("flavorPairs");

// My data is not published to GitHub. You can add more users and recipes as needed.
db.users.insert({ username: "chef123", email: "chef123@example.com", passwordHash: "hashedPassword" });

db.recipes.insert({
    title: "Spaghetti Carbonara",
    user_id: ObjectId("userObjectId"),
    ingredients: ["Pasta", "Eggs", "Cheese"],
    instructions: "Cook pasta. Mix with beaten eggs and cheese."
});

db.cookingTips.insert({ tip: "Add salt to water before boiling pasta." });

db.seasonalIngredients.insert({
    season: "Spring",
    ingredients: ["Asparagus", "Peas", "Mint"]
});

db.nutritionalTips.insert({ tip: "Eat a rainbow of fruits and vegetables to get a variety of nutrients." });

db.flavorPairs.insert({ ingredient: "Apple", pair: "Cinnamon" });
