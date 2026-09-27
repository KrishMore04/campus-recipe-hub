const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

let recipes = [
    {
        id: 1,
        name: "Masala Sandwich",
        category: "Snacks",
        ingredients: "Bread, onion, tomato, capsicum, cheese, spices",
        instructions: "Prepare the filling, place it between bread slices and toast until golden."
    },
    {
        id: 2,
        name: "Veg Biryani",
        category: "Lunch",
        ingredients: "Rice, vegetables, onion, tomato, spices",
        instructions: "Cook the vegetables and rice with spices and combine them together."
    },
    {
        id: 3,
        name: "Chocolate Mug Cake",
        category: "Dessert",
        ingredients: "Flour, cocoa powder, sugar, milk, chocolate",
        instructions: "Mix the ingredients in a mug and microwave until the cake is cooked."
    }
];

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.get("/api/recipes", (req, res) => {
    const search = (req.query.search || "").toLowerCase();

    const filteredRecipes = recipes.filter(recipe =>
        recipe.name.toLowerCase().includes(search) ||
        recipe.category.toLowerCase().includes(search) ||
        recipe.ingredients.toLowerCase().includes(search)
    );

    res.json(filteredRecipes);
});

app.post("/api/recipes", (req, res) => {
    const { name, category, ingredients, instructions } = req.body;

    if (!name || !category || !ingredients || !instructions) {
        return res.status(400).json({
            error: "All fields are required."
        });
    }

    if (name.trim().length < 3) {
        return res.status(400).json({
            error: "Recipe name must contain at least 3 characters."
        });
    }

    const newRecipe = {
        id: recipes.length + 1,
        name: name.trim(),
        category: category.trim(),
        ingredients: ingredients.trim(),
        instructions: instructions.trim()
    };

    recipes.push(newRecipe);

    res.status(201).json(newRecipe);
});

app.get("/api/commit", (req, res) => {
    res.json({
        commit: process.env.RENDER_GIT_COMMIT || "Local Development"
    });
});

app.listen(PORT, () => {
    console.log(`Campus Recipe Hub running on port ${PORT}`);
});