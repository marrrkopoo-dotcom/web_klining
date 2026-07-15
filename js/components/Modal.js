export class Modal {
  constructor(overlaySelector, triggerSelector, closeSelector) {
    this.overlay = document.querySelector(overlaySelector);
    this.triggers = document.querySelectorAll(triggerSelector);
    this.closeBtn = document.querySelector(closeSelector);
    this.init();
  }

  init() {
    if (this.overlay) {
      this.triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          this.open();
        });
      });

      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => this.close());
      }

      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) {
          this.close();
        }
      });
    }
  }

  open() {
    this.overlay.classList.add('active');
  }

  close() {
    this.overlay.classList.remove('active');
  }
}
