import { initializeAOS } from './utils/animations.js';
import { fetchDashboardStats, fetchFoodItems } from './api/foodItems.js';
import { showToast } from './utils/toast.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('Main.js loaded');
  initializeAOS();

  const userEmailSpan = document.getElementById('userEmail');
  const logoutBtn = document.getElementById('logoutBtn');
  const totalItems = document.getElementById('totalItems');
  const expiringSoon = document.getElementById('expiringSoon');
  const totalDonations = document.getElementById('totalDonations');
  const itemsAddedList = document.getElementById('itemsAddedList');
  const expiringSoonList = document.getElementById('expiringSoonList');
  const donationsList = document.getElementById('donationsList');
  const availableRecipes = document.getElementById('availableRecipes');
  const recipesList = document.getElementById('recipesList');

  // Fetch user profile
  if (localStorage.getItem('token')) {
    try {
      const response = await fetch('http://localhost:3000/api/auth/me', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.ok) throw new Error(await response.text());
      const { email } = await response.json();
      userEmailSpan.textContent = email;
    } catch (error) {
      console.error('Error fetching user:', error);
      userEmailSpan.textContent = 'Guest';
      localStorage.removeItem('token');
      showToast('Session expired. Please log in.', 'error');
      setTimeout(() => window.location.href = 'login.html', 2000);
    }
  } else {
    userEmailSpan.textContent = 'Guest';
    showToast('Please log in to view dashboard', 'error');
    setTimeout(() => window.location.href = 'login.html', 2000);
  }

  // Logout
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    showToast('Logged out successfully!');
    setTimeout(() => window.location.href = 'login.html', 1000);
  });

  // Fetch dashboard stats
  if (localStorage.getItem('token')) {
    try {
      const stats = await fetchDashboardStats();
      console.log('Stats received:', stats);
      totalItems.textContent = stats.totalItems || 0;
      expiringSoon.textContent = stats.expiringSoon || 0;
      totalDonations.textContent = stats.totalDonations || 0;

      // Fetch food items for hover content
      const foodItems = await fetchFoodItems();
      console.log('Food items received:', foodItems);
      if (foodItems.length > 0) {
        itemsAddedList.innerHTML = foodItems.map(item => `
          <p><strong>${item.name}</strong> (${item.quantity})</p>
        `).join('');
      } else {
        itemsAddedList.innerHTML = '<p>No items added yet.</p>';
      }

      const today = new Date();
      const threeDaysFromNow = new Date(today);
      threeDaysFromNow.setDate(today.getDate() + 3);
      const expiringItems = foodItems.filter(item => {
        const expiryDate = new Date(item.expiryDate);
        return expiryDate <= threeDaysFromNow && expiryDate >= today;
      });
      if (expiringItems.length > 0) {
        expiringSoonList.innerHTML = expiringItems.map(item => `
          <p><strong>${item.name}</strong> (Expires: ${new Date(item.expiryDate).toLocaleDateString()})</p>
        `).join('');
      } else {
        expiringSoonList.innerHTML = '<p>No items expiring soon.</p>';
      }

      // Fetch donations
      try {
        console.log('Fetching donations with token:', localStorage.getItem('token'));
        const donationsResponse = await fetch('http://localhost:3000/api/donations', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        console.log('Donations response status:', donationsResponse.status);
        const rawResponse = await donationsResponse.text();
        console.log('Raw donations response:', rawResponse);
        if (!donationsResponse.ok) {
          console.error('Donations fetch error:', rawResponse);
          if (donationsResponse.status === 401) {
            showToast('Unauthorized. Please log in again.', 'error');
            localStorage.removeItem('token');
            setTimeout(() => window.location.href = 'login.html', 2000);
            return;
          }
          throw new Error(rawResponse);
        }
        const donations = JSON.parse(rawResponse);
        console.log('Parsed donations:', donations);
        if (donations && Array.isArray(donations) && donations.length > 0) {
          const validDonations = donations.filter(d => d.foodItemId && d.foodItemName);
          console.log('Valid donations:', validDonations);
          if (validDonations.length > 0) {
            donationsList.innerHTML = validDonations.map(donation => `
              <p><strong>${donation.foodItemName}</strong> (Donated: ${new Date(donation.donatedAt).toLocaleDateString()})</p>
            `).join('');
          } else {
            console.warn('No valid donations after filtering');
            donationsList.innerHTML = '<p>No valid donations found.</p>';
          }
        } else {
          console.log('No donations returned from API');
          donationsList.innerHTML = '<p>No donations yet.</p>';
        }
      } catch (error) {
        console.error('Error fetching donations:', error.message);
        donationsList.innerHTML = '<p>Error loading donations: ${error.message}</p>';
        showToast('Failed to load donations: ' + error.message, 'error');
      }

      // Recipe suggestions (same as recipes.js)
      const ingredients = foodItems.map(item => item.name.toLowerCase());
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
      availableRecipes.textContent = available.length;
      if (available.length > 0) {
        recipesList.innerHTML = available.map(recipe => `
          <div class="recipe-item">
            <h4>${recipe.name}</h4>
            <p><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</p>
            <p>${recipe.description}</p>
          </div>
        `).join('');
      } else {
        recipesList.innerHTML = '<p>No ingredients available for recipes.</p>';
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      showToast('Failed to load dashboard stats: ' + error.message, 'error');
    }
  }
});