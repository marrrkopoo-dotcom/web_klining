import { Notification } from './Notification.js';

export class Cart {
  constructor() {
    this.items = {}; // { id: { name, price, qty, unit, total } }
    this.notification = new Notification();
    this.init();
  }

  init() {
    this.cacheDOM();
    this.bindEvents();
    this.updateUI();
  }

  cacheDOM() {
    this.priceItems = document.querySelectorAll('.price-item');
    this.cartWidget = document.getElementById('cart-widget');
    this.cartHeader = document.querySelector('.cart-header');
    this.cartTotalEl = document.querySelector('.cart-total');
    this.cartCountEl = document.querySelector('.cart-count');
    this.cartItemsList = document.getElementById('cart-items-list');
    this.modalOrderSummary = document.getElementById('modal-order-summary');
  }

  bindEvents() {
    // Add to cart buttons
    this.priceItems.forEach(item => {
      const btnAdd = item.querySelector('.btn-add');
      const inputQty = item.querySelector('.qty-input');
      const btnMinus = item.querySelector('.qty-btn.minus');
      const btnPlus = item.querySelector('.qty-btn.plus');

      if (btnMinus && btnPlus && inputQty) {
        btnMinus.addEventListener('click', () => {
          let val = parseInt(inputQty.value) || 0;
          if (val > 0) inputQty.value = val - 1;
        });
        btnPlus.addEventListener('click', () => {
          let val = parseInt(inputQty.value) || 0;
          inputQty.value = val + 1;
        });
      }
      
      btnAdd.addEventListener('click', () => {
        const id = item.dataset.id;
        const name = item.dataset.name;
        const price = parseFloat(item.dataset.price);
        const unit = item.dataset.unit;
        const qty = parseFloat(inputQty.value);

        if (qty > 0) {
          this.addItem(id, name, price, qty, unit);
          // Visual feedback via Notification
          this.notification.show(`${name} додано до кошика!`, 'success');
          
          btnAdd.textContent = "Додано!";
          btnAdd.style.background = "#28a745";
          setTimeout(() => {
            btnAdd.textContent = "Додати";
            btnAdd.style.background = "";
          }, 1000);
        } else {
          this.notification.show(`Будь ласка, вкажіть кількість/площу (${unit})`, 'error');
        }
      });
    });

    // Toggle cart body expansion
    if (this.cartHeader) {
      this.cartHeader.addEventListener('click', () => {
        if (Object.keys(this.items).length > 0) {
          this.cartWidget.classList.toggle('expanded');
        }
      });
    }

    // Remove item from cart list
    if (this.cartItemsList) {
      this.cartItemsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-remove')) {
          const id = e.target.dataset.id;
          this.removeItem(id);
        }
      });
    }
  }

  addItem(id, name, price, qty, unit) {
    if (this.items[id]) {
      this.items[id].qty += qty;
    } else {
      this.items[id] = { name, price, qty, unit };
    }
    this.items[id].total = this.items[id].price * this.items[id].qty;
    this.updateUI();
  }

  removeItem(id) {
    delete this.items[id];
    this.updateUI();
  }

  clearCart() {
    this.items = {};
    this.updateUI();
  }

  calculateTotal() {
    let totalSum = 0;
    let totalItems = 0;
    for (const key in this.items) {
      totalSum += this.items[key].total;
      totalItems += 1;
    }
    return { totalSum, totalItems };
  }

  updateUI() {
    const { totalSum, totalItems } = this.calculateTotal();

    // Toggle visibility
    if (totalItems > 0) {
      this.cartWidget.classList.add('visible');
    } else {
      this.cartWidget.classList.remove('visible');
      this.cartWidget.classList.remove('expanded');
    }

    // Update Header
    if (this.cartTotalEl) this.cartTotalEl.textContent = `${totalSum} грн`;
    if (this.cartCountEl) this.cartCountEl.textContent = `${totalItems} послуг`;

    // Update List
    if (this.cartItemsList) {
      this.cartItemsList.innerHTML = '';
      for (const id in this.items) {
        const item = this.items[id];
        const li = document.createElement('li');
        li.className = 'cart-item';
        li.innerHTML = `
          <div class="cart-item-info">
            <h5>${item.name}</h5>
            <span class="cart-item-price">${item.qty} ${item.unit} x ${item.price} грн = ${item.total} грн</span>
          </div>
          <button class="btn-remove" data-id="${id}">&times;</button>
        `;
        this.cartItemsList.appendChild(li);
      }
    }

    // Update Modal Summary if requested
    this.updateModalSummary(totalSum);
  }

  updateModalSummary(totalSum) {
    if (!this.modalOrderSummary) return;
    
    if (Object.keys(this.items).length === 0) {
      this.modalOrderSummary.style.display = 'none';
      return;
    }

    this.modalOrderSummary.style.display = 'block';
    let html = `<h4>Ваше замовлення:</h4><ul>`;
    for (const id in this.items) {
      const item = this.items[id];
      html += `<li>${item.name} (${item.qty} ${item.unit})</li>`;
    }
    html += `</ul><div class="total">До сплати: ${totalSum} грн</div>`;
    this.modalOrderSummary.innerHTML = html;
  }
}
