import { fetchFoodItems } from './api/foodItems.js';
import { showToast } from './utils/toast.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('Donate.js loaded');
  const form = document.querySelector('.donate-form');
  const foodItemSelect = document.getElementById('foodItem');
  const userEmailSpan = document.getElementById('userEmail');
  const logoutBtn = document.getElementById('logoutBtn');

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
  }

  // Logout
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    showToast('Logged out successfully!');
    setTimeout(() => window.location.href = 'login.html', 1000);
  });

  try {
    const foodItems = await fetchFoodItems();
    console.log('Food items received:', foodItems);
    foodItems.forEach(item => {
      const option = document.createElement('option');
      option.value = item._id;
      option.textContent = `${item.name} (${item.quantity})`;
      foodItemSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error loading food items:', error);
    showToast('Failed to load food items: ' + error.message, 'error');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const foodItemId = foodItemSelect.value;
    if (!foodItemId) {
      showToast('Please select a food item', 'error');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ foodItemId }),
      });

      if (!response.ok) throw new Error(await response.text());
      showToast('Donation successful!');
      form.reset();
    } catch (error) {
      console.error('Error donating item:', error);
      showToast('Failed to donate item: ' + error.message, 'error');
    }
  });
});