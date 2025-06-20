export class ErrorHandler {
  constructor(container = null) {
    this.container = container;
  }

  show(message) {
    if (!this.container && typeof document !== 'undefined') {
      this.container = document.getElementById('error-message');
    }
    if (this.container) {
      this.container.textContent = message;
      if (this.container.classList && this.container.classList.remove) {
        this.container.classList.remove('hidden');
      }
    } else {
      console.error(message);
    }
  }
}
