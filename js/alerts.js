import { fetchFoodItems, deleteFoodItem } from './api/foodItems.js';
import { showToast } from './utils/toast.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('Alerts.js loaded');

  const expiredList = document.getElementById('expired-items');
  const expiringSoonList = document.getElementById('expiring-soon-items');
  const freshList = document.getElementById('fresh-items');
  const userEmailSpan = document.getElementById('userEmail');
  const logoutBtn = document.getElementById('logoutBtn');

  const today = new Date();
  const threeDaysFromNow = new Date(today);
  threeDaysFromNow.setDate(today.getDate() + 3);

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

    if (foodItems.length === 0) {
      expiredList.innerHTML = '<p>No expired items.</p>';
      expiringSoonList.innerHTML = '<p>No items expiring soon.</p>';
      freshList.innerHTML = '<p>No fresh items.</p>';
      return;
    }

    foodItems.forEach(item => {
      const expiryDate = new Date(item.expiryDate);
      let container;
      let cardColorClass;

      if (expiryDate < today) {
        container = expiredList;
        cardColorClass = 'expired';
      } else if (expiryDate <= threeDaysFromNow) {
        container = expiringSoonList;
        cardColorClass = 'expiring-soon';
      } else {
        container = freshList;
        cardColorClass = 'fresh';
      }

      const card = document.createElement('div');
      card.className = `alert-card ${cardColorClass}`;
      card.innerHTML = `
        <h3>${item.name}</h3>
        <p>Quantity: ${item.quantity}</p>
        <p>Expires: ${expiryDate.toLocaleDateString()}</p>
        <button class="btn" onclick="deleteItem('${item._id}')">Delete</button>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading alerts:', error);
    showToast('Failed to load alerts: ' + error.message, 'error');
  }
});

// Make deleteItem globally accessible
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
