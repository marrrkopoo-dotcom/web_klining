import { Menu } from './components/Menu.js';
import { Modal } from './components/Modal.js';
import { Cart } from './components/Cart.js';

export class App {
  constructor() {
    this.initComponents();
  }

  initComponents() {
    // Initialize Mobile Menu
    this.menu = new Menu('.hamburger', '.nav-mobile');

    // Initialize Call Modal
    this.callModal = new Modal('.modal-overlay', '.open-modal', '.modal-close');

    // Initialize Shopping Cart
    this.cart = new Cart();
  }
}
