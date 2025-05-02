export function initializeAOS() {
  console.log('Initializing AOS');
  if (window.AOS) {
    AOS.init({ duration: 800, once: true });
  } else {
    console.warn('AOS library not loaded');
  }
}