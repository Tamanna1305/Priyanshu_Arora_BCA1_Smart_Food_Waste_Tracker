const API_BASE_URL = 'http://localhost:3000/api';

export async function addFoodItem(item) {
  console.log('Adding food item, token:', localStorage.getItem('token'));
  const response = await fetch(`${API_BASE_URL}/food-items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(item),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

export async function fetchFoodItems() {
  console.log('Fetching food items, token:', localStorage.getItem('token'));
  const response = await fetch(`${API_BASE_URL}/food-items`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

export async function deleteFoodItem(id) {
  console.log('Deleting food item:', id);
  const response = await fetch(`${API_BASE_URL}/food-items/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) throw new Error(await response.text());
}

export async function fetchDashboardStats() {
  console.log('Fetching dashboard stats, token:', localStorage.getItem('token'));
  const response = await fetch(`${API_BASE_URL}/food-items/stats`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}