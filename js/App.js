import { CookieBanner } from './components/CookieBanner.js?v=2.0';
import { PromoModal } from './components/PromoModal.js?v=2.0';
import { Menu } from './components/Menu.js?v=2.0';
import { Modal } from './components/Modal.js?v=2.0';
import { Cart } from './components/Cart.js?v=2.0';
import { FormHandler } from './components/FormHandler.js?v=2.0';

export class App {
  constructor() {
    this.initComponents();
  }

  initComponents() {
    this.cookieBanner = new CookieBanner();
    this.promoModal = new PromoModal();
    // Initialize Mobile Menu
    this.menu = new Menu('.hamburger', '.nav-mobile');

    // Initialize Call Modal
    this.callModal = new Modal('.modal-overlay', '.open-modal', '.modal-close');

    // Initialize Shopping Cart
    this.cart = new Cart();

    // Initialize Form Handler (Telegram Bot)
    this.formHandler = new FormHandler(this.cart, this.callModal);
  }
}
