export class CookieBanner {
  constructor() {
    this.init();
  }

  init() {
    if (localStorage.getItem('cookieAccepted')) {
      return; // Already accepted
    }

    this.createBanner();
    
    // Slight delay for animation
    setTimeout(() => {
      this.banner.classList.add('show');
    }, 500);
  }

  createBanner() {
    this.banner = document.createElement('div');
    this.banner.className = 'cookie-banner';
    this.banner.innerHTML = `
      <div class="cookie-container">
        <p class="cookie-text">Ми використовуємо файли cookie, щоб аналізувати трафік та підбирати для вас найкращий контент. Продовжуючи користуватись сайтом, ви погоджуєтесь з цим.</p>
        <button class="cookie-btn">Зрозуміло</button>
      </div>
    `;

    document.body.appendChild(this.banner);

    const btn = this.banner.querySelector('.cookie-btn');
    btn.addEventListener('click', () => {
      localStorage.setItem('cookieAccepted', 'true');
      this.banner.classList.remove('show');
      setTimeout(() => {
        this.banner.remove();
      }, 500); // Wait for transition
    });
  }
}