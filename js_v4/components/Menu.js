export class Menu {
  constructor(hamburgerSelector, navMobileSelector) {
    this.hamburger = document.querySelector(hamburgerSelector);
    this.navMobile = document.querySelector(navMobileSelector);
    this.init();
  }

  init() {
    if (this.hamburger && this.navMobile) {
      this.hamburger.addEventListener('click', () => this.toggleMenu());
    }
  }

  toggleMenu() {
    this.navMobile.classList.toggle('active');
  }
}
