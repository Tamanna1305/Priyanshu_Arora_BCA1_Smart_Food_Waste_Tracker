import { initializeAOS } from './utils/animations.js';
import { fetchFoodItems } from './api/foodItems.js';
import { showToast } from './utils/toast.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('Recipes.js loaded');
  initializeAOS();

  const userEmailSpan = document.getElementById('userEmail');
  const logoutBtn = document.getElementById('logoutBtn');
  const recipesList = document.getElementById('recipesList');

  // Fetch user profile
  if (localStorage.getItem('token')) {
    try {
      console.log('Fetching user profile with token:', localStorage.getItem('token'));
      const response = await fetch('http://localhost:3000/api/auth/me', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      console.log('User profile response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('User profile fetch error:', errorText);
        throw new Error(errorText);
      }
      const { email } = await response.json();
      userEmailSpan.textContent = email;
      console.log('User profile fetched:', email);
    } catch (error) {
      console.error('Error fetching user:', error.message);
      userEmailSpan.textContent = 'Guest';
      localStorage.removeItem('token');
      showToast('Session expired. Please log in.', 'error');
      setTimeout(() => window.location.href = 'login.html', 2000);
      return;
    }
  } else {
    console.warn('No token found in localStorage');
    userEmailSpan.textContent = 'Guest';
    showToast('Please log in to view recipes', 'error');
    setTimeout(() => window.location.href = 'login.html', 2000);
    return;
  }

  // Logout
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    showToast('Logged out successfully!');
    setTimeout(() => window.location.href = 'login.html', 1000);
  });

  // Fetch food items and render recipes
  try {
    console.log('Fetching food items...');
    const foodItems = await fetchFoodItems();
    console.log('Food items received:', foodItems);
    
    if (!foodItems || foodItems.length === 0) {
      console.warn('No food items found in database');
      recipesList.innerHTML = '<p>No food items added yet. <a href="add.html" class="btn">Add items</a> to see recipes.</p>';
      showToast('Add food items to discover recipes!', 'info');
      return;
    }

    const ingredients = foodItems.map(item => item.name.toLowerCase());
    console.log('Available ingredients:', ingredients);

    // recipe list
    const recipes = [
      { name: 'Apple Pie', ingredients: ['apples', 'flour', 'sugar', 'butter'], description: 'A classic dessert with a flaky crust and sweet apple filling.' },
      { name: 'Fried Rice', ingredients: ['rice', 'eggs', 'vegetables', 'soy sauce'], description: 'A quick stir-fry with veggies and savory soy sauce.' },
      { name: 'Egg Sandwich', ingredients: ['eggs', 'bread', 'butter', 'cheese'], description: 'A simple, hearty breakfast sandwich.' },
      { name: 'Milkshake', ingredients: ['milk', 'ice cream', 'sugar', 'vanilla'], description: 'A creamy, refreshing drink perfect for any time.' },
      { name: 'Vegetable Stir-Fry', ingredients: ['vegetables', 'soy sauce', 'rice', 'oil'], description: 'A colorful, healthy dish with a savory sauce.' },
      { name: 'Banana Bread', ingredients: ['bananas', 'flour', 'sugar', 'eggs'], description: 'Moist and sweet, perfect for using ripe bananas.' },
      { name: 'Pasta Primavera', ingredients: ['pasta', 'vegetables', 'cheese', 'olive oil'], description: 'A light pasta with fresh veggies and parmesan.' },
      { name: 'Omelette', ingredients: ['eggs', 'cheese', 'vegetables', 'butter'], description: 'A fluffy egg dish with customizable fillings.' },
      { name: 'Fruit Salad', ingredients: ['apples', 'bananas', 'berries', 'yogurt'], description: 'A refreshing mix of fruits with a creamy yogurt dressing.' },
      { name: 'Rice Pudding', ingredients: ['rice', 'milk', 'sugar', 'cinnamon'], description: 'A comforting, creamy dessert with warm spices.' },
      { name: 'Grilled Cheese', ingredients: ['bread', 'cheese', 'butter'], description: 'A crispy, melty sandwich that’s always a hit.' },
      { name: 'Vegetable Soup', ingredients: ['vegetables', 'broth', 'tomatoes', 'herbs'], description: 'A hearty, warming soup packed with nutrients.' },
      { name: 'Pancakes', ingredients: ['flour', 'milk', 'eggs', 'sugar'], description: 'Fluffy pancakes perfect for breakfast or brunch.' },
      { name: 'Smoothie', ingredients: ['berries', 'bananas', 'milk', 'yogurt'], description: 'A blended drink full of fruit and creamy goodness.' },
      { name: 'Baked Apples', ingredients: ['apples', 'sugar', 'cinnamon', 'butter'], description: 'Warm, spiced apples baked to perfection.' },
      { name: 'Tomato Basil Soup', ingredients: ['tomatoes', 'basil', 'cream', 'broth'], description: 'A rich, creamy soup with fresh basil notes.' },
      { name: 'Chicken Stir-Fry', ingredients: ['chicken', 'vegetables', 'soy sauce', 'rice'], description: 'A protein-packed dish with bold flavors.' },
      { name: 'Chocolate Chip Cookies', ingredients: ['flour', 'sugar', 'butter', 'chocolate'], description: 'Chewy cookies with gooey chocolate chips.' },
      { name: 'Caesar Salad', ingredients: ['lettuce', 'cheese', 'croutons', 'dressing'], description: 'A crisp salad with a tangy, creamy dressing.' },
      { name: 'Mashed Potatoes', ingredients: ['potatoes', 'butter', 'milk', 'salt'], description: 'Creamy, buttery potatoes for a comforting side.' },
      { name: 'Berry Parfait', ingredients: ['berries', 'yogurt', 'granola', 'honey'], description: 'A layered dessert with fruit and crunchy granola.' },
      { name: 'Spaghetti Bolognese', ingredients: ['pasta', 'beef', 'tomatoes', 'herbs'], description: 'A rich, meaty pasta dish with robust flavors.' },
      { name: 'Avocado Toast', ingredients: ['bread', 'avocado', 'eggs', 'lemon'], description: 'A trendy, healthy breakfast with creamy avocado.' },
      { name: 'French Toast', ingredients: ['bread', 'eggs', 'milk', 'cinnamon'], description: 'Sweet, custardy toast perfect for mornings.' },
      { name: 'Caprese Salad', ingredients: ['tomatoes', 'mozzarella', 'basil', 'olive oil'], description: 'A fresh, vibrant salad with Italian flavors.' },
    ];

    const available = recipes.filter(recipe =>
      recipe.ingredients.some(ing => ingredients.includes(ing))
    );
    console.log('Available recipes:', available);

    if (available.length > 0) {
      recipesList.innerHTML = available.map(recipe => `
        <div class="recipe-card">
          <h3>${recipe.name}</h3>
          <p><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</p>
          <p>${recipe.description}</p>
        </div>
      `).join('');
    } else {
      console.warn('No recipes match available ingredients');
      recipesList.innerHTML = '<p>No recipes match your ingredients. <a href="add.html" class="btn">Add more items</a>.</p>';
      showToast('No recipes found. Try adding more ingredients.', 'info');
    }
  } catch (error) {
    console.error('Error fetching recipes:', error.message);
    recipesList.innerHTML = '<p>Error loading recipes: ' + error.message + '. <a href="add.html" class="btn">Add items</a>.</p>';
    showToast('Failed to load recipes: ' + error.message, 'error');
  }
});