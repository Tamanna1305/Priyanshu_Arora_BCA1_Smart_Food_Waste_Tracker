import { fetchFoodItems, deleteFoodItem } from './api/foodItems.js';
import { showToast } from './utils/toast.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('Alerts.js loaded');
  const alertsList = document.getElementById('alertsList');
  const userEmailSpan = document.getElementById('userEmail');
  const logoutBtn = document.getElementById('logoutBtn');
  const today = new Date();

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
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(today.getDate() + 3);
    const expiringItems = foodItems.filter(item => {
      const expiryDate = new Date(item.expiryDate);
      return expiryDate <= threeDaysFromNow && expiryDate >= today;
    });

    if (expiringItems.length === 0) {
      alertsList.innerHTML = '<p>No items expiring soon.</p>';
      return;
    }

    expiringItems.forEach(item => {
      const card = document.createElement('div');
      card.className = 'alert-card';
      card.innerHTML = `
        <h3>${item.name}</h3>
        <p>Quantity: ${item.quantity}</p>
        <p>Expires: ${new Date(item.expiryDate).toLocaleDateString()}</p>
        <button class="btn" onclick="deleteItem('${item._id}')">Delete</button>
      `;
      alertsList.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading alerts:', error);
    showToast('Failed to load alerts: ' + error.message, 'error');
  }
});

window.deleteItem = async (id) => {
  try {
    await deleteFoodItem(id);
    showToast('Item deleted successfully!');
    location.reload();
  } catch (error) {
    console.error('Error deleting item:', error);
    showToast('Failed to delete item: ' + error.message, 'error');
  }
};