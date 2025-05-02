export function showToast(message, type = 'success') {
  console.log('Showing toast:', message, type);
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

const style = document.createElement('style');
style.textContent = `
  .toast {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    color: white;
    font-size: 1rem;
    opacity: 1;
    transition: opacity 0.3s ease;
    z-index: 1000;
  }
  .toast-success {
    background-color: #14532d;
  }
  .toast-error {
    background-color: #dc2626;
  }
`;
document.head.appendChild(style);