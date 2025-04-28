document.addEventListener("DOMContentLoaded", () => {
  const recipeSection = document.getElementById("recipe-suggestions");

  const recipeMap = {
    bread: {
      title: "Cheesy Bread Pizza",
      ingredients: ["Bread slices", "Cheese", "Tomato sauce", "Capsicum", "Onion", "Oregano"],
      steps: [
        "Spread tomato sauce on bread slices.",
        "Top with chopped veggies and cheese.",
        "Sprinkle oregano and bake for 10 mins at 180°C.",
        "Serve hot with ketchup."
      ]
    },
    milk: {
      title: "Creamy Milk Pudding",
      ingredients: ["Milk", "Sugar", "Cornflour", "Vanilla essence", "Dry fruits"],
      steps: [
        "Boil milk with sugar and a few drops of vanilla.",
        "Add cornflour mixed with water to thicken.",
        "Pour into bowls, top with dry fruits.",
        "Chill in fridge and serve cold."
      ]
    },
    wheat: {
      title: "Masala Chapati Rolls",
      ingredients: ["Wheat flour", "Mixed veggies", "Spices", "Butter", "Tomato ketchup"],
      steps: [
        "Make chapatis from wheat dough.",
        "Stir-fry veggies with spices.",
        "Spread ketchup on chapati, fill with veggies.",
        "Roll and toast lightly with butter."
      ]
    },
    tomatoes: {
      title: "Spicy Tomato Chutney",
      ingredients: ["Tomatoes", "Garlic", "Mustard seeds", "Red chili", "Salt", "Oil"],
      steps: [
        "Chop tomatoes and garlic.",
        "Heat oil, add mustard seeds and chili.",
        "Add tomatoes and salt, cook till soft.",
        "Blend for a smooth chutney."
      ]
    },
    yogurt: {
      title: "Refreshing Cucumber Raita",
      ingredients: ["Yogurt", "Cucumber", "Salt", "Cumin powder", "Coriander"],
      steps: [
        "Grate or chop cucumber.",
        "Mix into yogurt with salt and cumin.",
        "Garnish with chopped coriander.",
        "Serve chilled with rice or roti."
      ]
    }
  };

  const foodItems = JSON.parse(localStorage.getItem("foodItems")) || [];

  const today = new Date().toISOString().split("T")[0];

  const expiringSoon = foodItems.filter(item => {
    const expiry = new Date(item.expiry);
    const todayDate = new Date(today);
    const timeDiff = expiry - todayDate;
    const daysDiff = timeDiff / (1000 * 3600 * 24);
    return daysDiff >= 0 && daysDiff <= 5;
  });

  if (expiringSoon.length === 0) {
    recipeSection.innerHTML = "<p class='center-text'>No recipes to suggest right now. You're all stocked up!</p>";
    return;
  }

  expiringSoon.forEach(item => {
    const name = item.food.toLowerCase();
    const recipe = recipeMap[name];

    const div = document.createElement("div");
    div.classList.add("recipe-card");

    if (recipe) {
      div.innerHTML = `
        <h3>${recipe.title}</h3>
        <p><strong>Ingredients:</strong></p>
        <ul>${recipe.ingredients.map(ing => `<li>${ing}</li>`).join("")}</ul>
        <p><strong>Steps:</strong></p>
        <ol>${recipe.steps.map(step => `<li>${step}</li>`).join("")}</ol>
      `;
    } else {
      div.innerHTML = `
        <h3>Quick ${item.food} Delight</h3>
        <p>No custom recipe found. Try cooking something simple with your ${item.food}!</p>
      `;
    }

    recipeSection.appendChild(div);
  });
});
