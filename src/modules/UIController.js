export class UIController {
  constructor(renderer) {
    this.renderer = renderer;
    this.toggleButton = document.getElementById('toggle-renderer');
  }

  init() {
    this.toggleButton.addEventListener('click', () => {
      this.renderer.animating = !this.renderer.animating;
      this.toggleButton.textContent = this.renderer.animating ? 'Stop' : 'Start';
    });
  }
}
