export class Modal {
  constructor(overlaySelector, triggerSelector, closeSelector) {
    this.overlay = document.querySelector(overlaySelector);
    this.triggers = document.querySelectorAll(triggerSelector);
    this.closeBtn = document.querySelector(closeSelector);
    this.modalTitle = this.overlay ? this.overlay.querySelector('h3') : null;
    this.form = this.overlay ? this.overlay.querySelector('form') : null;
    this.init();
  }

  init() {
    if (this.overlay) {
      this.triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          
          // Populate context
          const subject = trigger.getAttribute('data-subject') || 'Замовити послугу';
          if (this.modalTitle) {
            // Remove text in parentheses for the display title (e.g., "(Банер)")
            this.modalTitle.textContent = subject.replace(/\s*\(.*?\)\s*/g, '').trim();
          }

          // Ensure hidden input exists
          if (this.form) {
            let hiddenInput = this.form.querySelector('input[name="subject"]');
            if (!hiddenInput) {
              hiddenInput = document.createElement('input');
              hiddenInput.type = 'hidden';
              hiddenInput.name = 'subject';
              this.form.appendChild(hiddenInput);
            }
            hiddenInput.value = subject;
          }

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
