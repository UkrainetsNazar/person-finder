const toastEl = (document.getElementById('toast'));
let hideTimer = 0;

export const showToast = (message, duration = 3000) => {
  toastEl.textContent = message;
  toastEl.classList.add('is-visible');

  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    toastEl.classList.remove('is-visible');
  }, duration);
};
