import { showToast } from './utils/toast.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Signup.js loaded');
  const form = document.getElementById('signupForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.email.value;
    const password = form.password.value;

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error(await response.text());
      const { token } = await response.json();
      localStorage.setItem('token', token);
      showToast('Signed up successfully!');
      window.location.href = 'index.html';
    } catch (error) {
      console.error('Signup error:', error);
      showToast('Signup failed: ' + error.message, 'error');
    }
  });
});