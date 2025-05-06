import { fetchFoodItems } from './api/foodItems.js';
import { showToast } from './utils/toast.js';

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.querySelector('.donate-form');
  const foodItemSelect = document.getElementById('foodItem');
  const donationList = document.getElementById('donationList');
  const userEmailSpan = document.getElementById('userEmail');
  const logoutBtn = document.getElementById('logoutBtn');

  // Fetch and display user
  if (localStorage.getItem('token')) {
    try {
      const res = await fetch('http://localhost:3000/api/auth/me', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const { email } = await res.json();
      userEmailSpan.textContent = email;
    } catch {
      showToast('Session expired.', 'error');
      setTimeout(() => window.location.href = 'login.html', 2000);
    }
  }

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    showToast('Logged out successfully!');
    setTimeout(() => window.location.href = 'login.html', 1000);
  });

  // Load available food items
  try {
    const foodItems = await fetchFoodItems();
    foodItems.forEach(item => {
      const option = document.createElement('option');
      option.value = item._id;
      option.textContent = `${item.name} (${item.quantity})`;
      foodItemSelect.appendChild(option);
    });
  } catch (error) {
    showToast('Failed to load food items.', 'error');
  }

  // Load existing donations
  async function loadDonations() {
    donationList.innerHTML = '';
    try {
      const res = await fetch('http://localhost:3000/api/donations', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const donations = await res.json();
      donations.forEach(donation => {
        const li = document.createElement('li');
        li.textContent = `${donation.foodItemName} | Pickup: ${donation.pickupDate} at ${donation.pickupTime}`;

        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.classList.add('delete-btn');
        delBtn.onclick = async () => {
          try {
            await fetch(`http://localhost:3000/api/donations/${donation._id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            showToast('Donation deleted.');
            loadDonations();
          } catch {
            showToast('Failed to delete.', 'error');
          }
        };
        li.appendChild(delBtn);
        donationList.appendChild(li);
      });
    } catch {
      showToast('Error loading donations.', 'error');
    }
  }
  loadDonations();

  // Form submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const foodItemId = foodItemSelect.value;
    const pickupDate = document.getElementById('pickupDate').value;
    const pickupTime = document.getElementById('pickupTime').value;

    try {
      await fetch('http://localhost:3000/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ foodItemId, pickupDate, pickupTime })
      });
      showToast('Donation successful!');
      form.reset();
      loadDonations();
    } catch (error) {
      showToast('Failed to donate.', 'error');
    }
  });
});
