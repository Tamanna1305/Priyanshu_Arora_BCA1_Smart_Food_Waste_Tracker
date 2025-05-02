import { showToast } from './utils/toast.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Login.js loaded');
  const form = document.getElementById('loginForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.email.value;
    const password = form.password.value;

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error(await response.text());
      const { token } = await response.json();
      localStorage.setItem('token', token);
      showToast('Logged in successfully!');
      window.location.href = 'index.html';
    } catch (error) {
      console.error('Login error:', error);
      showToast('Login failed: ' + error.message, 'error');
    }
  });
});

