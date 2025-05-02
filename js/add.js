import { addFoodItem } from './api/foodItems.js';
import { showToast } from './utils/toast.js';

let recognition;
try {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
  } else {
    console.warn('SpeechRecognition API not supported in this browser.');
  }
} catch (error) {
  console.error('Error initializing SpeechRecognition:', error);
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('Add.js loaded');
  const form = document.querySelector('.food-form');
  const foodSelect = document.getElementById('food');
  const customFoodContainer = document.getElementById('customFoodContainer');
  const customFoodInput = document.getElementById('customFood');
  const voiceFoodBtn = document.getElementById('voiceFoodBtn');
  const voiceQtyBtn = document.getElementById('voiceQtyBtn');
  const voiceStatus = document.getElementById('voice-status');
  const userEmailSpan = document.getElementById('userEmail');
  const logoutBtn = document.getElementById('logoutBtn');

  // Fetch user profile
  if (localStorage.getItem('token')) {
    fetch('http://localhost:3000/api/auth/me', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch user');
        return response.json();
      })
      .then(data => {
        userEmailSpan.textContent = data.email;
      })
      .catch(error => {
        console.error('Error fetching user:', error);
        userEmailSpan.textContent = 'Guest';
        localStorage.removeItem('token');
      });
  } else {
    userEmailSpan.textContent = 'Guest';
  }

  // Logout
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    showToast('Logged out successfully!');
    setTimeout(() => window.location.href = 'login.html', 1000);
  });

  if (!recognition) {
    voiceFoodBtn.style.display = 'none';
    voiceQtyBtn.style.display = 'none';
  }

  foodSelect.addEventListener('change', () => {
    if (foodSelect.value === 'Other') {
      customFoodContainer.style.display = 'block';
      customFoodInput.required = true;
    } else {
      customFoodContainer.style.display = 'none';
      customFoodInput.required = false;
      customFoodInput.value = '';
    }
  });

  if (recognition) {
    voiceFoodBtn.addEventListener('click', () => startVoiceRecognition('food', voiceStatus));
    voiceQtyBtn.addEventListener('click', () => startVoiceRecognition('quantity', voiceStatus));
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const foodValue = foodSelect.value === 'Other' ? customFoodInput.value : foodSelect.value;
    console.log(foodValue)
    if (!foodValue) {
      showToast('Please select or enter a food item', 'error');
      return;
    }

    const foodItem = {
      name: foodValue,
      quantity: form.quantity.value,
      purchaseDate: form.purchase.value,
      expiryDate: form.expiry.value,
    };

    console.log('Sending food item:', foodItem);
    try {
      const result = await addFoodItem(foodItem);
      console.log('Add item response:', result);
      showToast('Food item added successfully!');
      form.reset();
      customFoodContainer.style.display = 'none';
      customFoodInput.required = false;
      foodSelect.value = '';
    } catch (error) {
      console.error('Add item error:', error);
      showToast('Failed to add food item: ' + error.message, 'error');
    }
  });
});

function startVoiceRecognition(fieldId, statusElement) {
  if (!recognition) return;

  const input = fieldId === 'food' && document.getElementById('food').value === 'Other' 
    ? document.getElementById('customFood') 
    : document.getElementById(fieldId);
  const micBtn = document.querySelector(`#voice${fieldId === 'food' ? 'Food' : 'Qty'}Btn`);

  recognition.onstart = () => {
    statusElement.textContent = 'Listening...';
    micBtn.classList.add('listening');
  };

  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map(result => result[0].transcript)
      .join('');
    input.value = transcript;
    statusElement.textContent = `Heard: ${transcript}`;
  };

  recognition.onerror = (event) => {
    statusElement.textContent = `Error: ${event.error}`;
    micBtn.classList.remove('listening');
  };

  recognition.onend = () => {
    statusElement.textContent = '';
    micBtn.classList.remove('listening');
  };

  recognition.start();
}