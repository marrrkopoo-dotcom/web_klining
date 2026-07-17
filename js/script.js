
/* --- components\Notification.js --- */
class Notification {
  constructor() {
    this.container = document.getElementById('notification-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'notification-container';
      document.body.appendChild(this.container);
    }
  }

  show(message, type = 'info', duration = 3000) {
    const notif = document.createElement('div');
    notif.className = `notification notification-${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'warning') icon = '⚠️';

    notif.innerHTML = `
      <div class="notification-icon">${icon}</div>
      <div class="notification-message">${message}</div>
    `;

    this.container.appendChild(notif);

    // Trigger animation
    setTimeout(() => {
      notif.classList.add('show');
    }, 10);

    setTimeout(() => {
      notif.classList.remove('show');
      notif.addEventListener('transitionend', () => {
        notif.remove();
      });
    }, duration);
  }
}

/* --- utils\validation.js --- */
function validateName(name) {
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return 'Ім\'я повинно містити щонайменше 2 символи';
  }
  // Allow letters (Latin + Cyrillic including Ukrainian), spaces, dashes, apostrophes
  const nameRegex = /^[a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ\s'-]+$/;
  if (!nameRegex.test(trimmed)) {
    return 'Ім\'я повинно містити тільки літери';
  }
  
  // Enforce capitalization: each word must start with an uppercase letter
  const words = trimmed.split(/\s+/);
  const capitalRegex = /^[A-ZА-ЯЁІЇЄҐ]/;
  for (const word of words) {
    if (!capitalRegex.test(word)) {
      return 'Кожне слово повинно починатися з великої літери';
    }
  }
  return null;
}

function validatePhone(phone) {
  // Extract only digits
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length !== 9) {
    return 'Введіть номер повністю: (XX) XXX-XX-XX';
  }
  return null;
}

function showError(inputElement, message) {
  const wrapper = inputElement.closest('.phone-input-wrapper') || inputElement;
  inputElement.classList.add('invalid');
  let errorDiv = wrapper.parentNode.querySelector('.error-message');
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    wrapper.parentNode.appendChild(errorDiv);
  }
  errorDiv.textContent = message;
}

function clearError(inputElement) {
  const wrapper = inputElement.closest('.phone-input-wrapper') || inputElement;
  inputElement.classList.remove('invalid');
  const errorDiv = wrapper.parentNode.querySelector('.error-message');
  if (errorDiv) {
    errorDiv.remove();
  }
}

function setupRealtimeValidation(form, fields) {
  fields.forEach(({ name, validator }) => {
    const input = form.querySelector(`[name="${name}"]`);
    if (input) {
      input.addEventListener('input', () => {
        const error = validator(input.value);
        if (error) {
          showError(input, error);
        } else {
          clearError(input);
        }
      });
      input.addEventListener('blur', () => {
        const error = validator(input.value);
        if (error) {
          showError(input, error);
        } else {
          clearError(input);
        }
      });
    }
  });
}

function initPhoneInputs() {
  document.querySelectorAll('input[name="phone"]').forEach(input => {
    if (input.parentNode.classList.contains('phone-input-wrapper')) return;

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'phone-input-wrapper';
    
    // Insert wrapper before input
    input.parentNode.insertBefore(wrapper, input);
    
    // Create flag & prefix prefix
    const prefix = document.createElement('span');
    prefix.className = 'phone-prefix';
    prefix.innerHTML = '🇺🇦 +380';
    
    // Reparent input
    wrapper.appendChild(prefix);
    wrapper.appendChild(input);

    input.placeholder = '(99) 123-45-67';
    input.maxLength = 15; // Length of (99) 123-45-67

    // Auto-masking on input
    input.addEventListener('input', () => {
      let val = input.value.replace(/\D/g, '');
      
      if (val.startsWith('0')) {
        val = val.substring(1);
      }
      val = val.substring(0, 9);
      
      input.value = formatDigits(val);
    });

    // Handle backspace properly so cursor doesn't get stuck on formatting chars
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace') {
        const val = input.value;
        const start = input.selectionStart;
        if (start > 0 && [' ', ')', '-'].includes(val[start - 1])) {
          e.preventDefault();
          let digits = val.substring(0, start).replace(/\D/g, '');
          digits = digits.substring(0, digits.length - 1);
          input.value = formatDigits(digits) + val.substring(input.selectionEnd);
          input.selectionStart = input.selectionEnd = Math.max(0, start - 2);
        }
      }
    });
  });
}

function formatDigits(val) {
  let formatted = '';
  if (val.length > 0) {
    formatted += '(' + val.substring(0, 2);
  }
  if (val.length >= 2) {
    formatted += ') ';
  }
  if (val.length > 2) {
    formatted += val.substring(2, 5);
  }
  if (val.length >= 5) {
    formatted += '-';
  }
  if (val.length > 5) {
    formatted += val.substring(5, 7);
  }
  if (val.length >= 7) {
    formatted += '-';
  }
  if (val.length > 7) {
    formatted += val.substring(7, 9);
  }
  return formatted;
}

/* --- components\Menu.js --- */
class Menu {
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

/* --- components\Modal.js --- */
class Modal {
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

/* --- components\Cart.js --- */
class Cart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('cartItems')) || {}; // { id: { name, price, qty, unit, total } }
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
          const unit = item.dataset.unit;
          if (unit === 'м²' && val >= 900) {
            this.notification.show("Максимальна площа для замовлення — 900 м²", "error");
            return;
          }
          if (unit === 'шт' && val >= 10) {
            this.notification.show("Максимальна кількість для одного товару — 10 шт", "error");
            return;
          }
          inputQty.value = val + 1;
        });
        
        inputQty.addEventListener('input', () => {
          let val = parseFloat(inputQty.value) || 0;
          const unit = item.dataset.unit;
          if (unit === 'м²' && val > 900) {
            inputQty.value = 900;
            this.notification.show("Максимальна площа для замовлення — 900 м²", "error");
          }
          if (unit === 'шт' && val > 10) {
            inputQty.value = 10;
            this.notification.show("Максимальна кількість для одного товару — 10 шт", "error");
          }
        });
      }
      
      btnAdd.addEventListener('click', () => {
        const id = item.dataset.id;
        const name = item.dataset.name;
        const price = parseFloat(item.dataset.price);
        const unit = item.dataset.unit;
        const qty = parseFloat(inputQty.value);

        if (unit === 'м²') {
          const currentTotal = this.getTotalSqMetersInCart();
          if (currentTotal + qty > 900) {
            const allowed = Math.max(0, 900 - currentTotal);
            this.notification.show(`Загальна площа в кошику не може перевищувати 900 м². Ви можете додати ще максимум ${allowed} м². Для більшої площі зв'яжіться з нами по телефону.`, "error");
            return;
          }
        }

        if (unit === 'шт') {
          const currentItemQty = this.items[id] ? this.items[id].qty : 0;
          if (currentItemQty + qty > 10) {
            const allowed = Math.max(0, 10 - currentItemQty);
            this.notification.show(`Максимальна кількість для послуги "${name}" — 10 шт. Ви можете додати ще ${allowed} шт.`, "error");
            return;
          }
        }

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

  saveCart() {
    localStorage.setItem('cartItems', JSON.stringify(this.items));
  }

  addItem(id, name, price, qty, unit) {
    if (this.items[id]) {
      this.items[id].qty += qty;
    } else {
      this.items[id] = { name, price, qty, unit };
    }
    this.items[id].total = this.items[id].price * this.items[id].qty;
    this.saveCart();
    this.updateUI();
  }

  removeItem(id) {
    delete this.items[id];
    this.saveCart();
    this.updateUI();
  }

  clearCart() {
    this.items = {};
    this.saveCart();
    this.updateUI();
  }

  getTotalSqMetersInCart() {
    let totalSqM = 0;
    for (const key in this.items) {
      if (this.items[key].unit === 'м²') {
        totalSqM += this.items[key].qty;
      }
    }
    return totalSqM;
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

/* --- components\FormHandler.js --- */
class FormHandler {
  constructor(cart, modal) {
    this.cart = cart;
    this.modal = modal;
    this.form = document.getElementById('order-form');
    this.notification = new Notification();
    
    // Telegram Credentials
    this.BOT_TOKEN = '8986924734:AAE5TIbbb7BFEgWfyaHFov2aoKDA52UIBo8';
    this.CHAT_ID = '-1003921545216';

    this.init();
  }

  init() {
    if (this.form) {
      this.form.addEventListener('submit', this.handleSubmit.bind(this));
      
      setupRealtimeValidation(this.form, [
        { name: 'name', validator: validateName },
        { name: 'phone', validator: validatePhone }
      ]);
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    const nameInput = this.form.querySelector('[name="name"]');
    const phoneInput = this.form.querySelector('[name="phone"]');

    const nameError = validateName(nameInput.value);
    const phoneError = validatePhone(phoneInput.value);

    let hasErrors = false;
    if (nameError) {
      showError(nameInput, nameError);
      hasErrors = true;
    } else {
      clearError(nameInput);
    }

    if (phoneError) {
      showError(phoneInput, phoneError);
      hasErrors = true;
    } else {
      clearError(phoneInput);
    }

    if (hasErrors) {
      return;
    }

    const formData = new FormData(this.form);
    const name = formData.get('name');
    const phone = formData.get('phone');
    const subject = formData.get('subject') || 'Замовити консультацію';

    const submitBtn = this.form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Відправка...';
    submitBtn.disabled = true;

    try {
      let message = `🔔 <b>Нова заявка з сайту Клінко!</b>\n\n`;
      message += `👤 <b>Ім'я:</b> ${name}\n`;
      message += `📞 <b>Телефон:</b> +380 ${phone}\n`;
      message += `🎯 <b>Тема:</b> ${subject}\n`;

      const { totalSum, totalItems } = this.cart.calculateTotal();
      if (totalItems > 0 && subject.includes('кошика')) {
        message += `\n🛒 <b>Кошик:</b>\n`;
        for (const id in this.cart.items) {
          const item = this.cart.items[id];
          message += `- ${item.name} (${item.qty} ${item.unit}) = ${item.total} грн\n`;
        }
        message += `\n💰 <b>Загальна сума:</b> ${totalSum} грн\n`;
      }

      const response = await fetch(`https://api.telegram.org/bot${this.BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: this.CHAT_ID,
          text: message,
          parse_mode: 'HTML'
        })
      });

      if (response.ok) {
        this.form.reset();
        this.cart.clearCart();
        this.modal.close();
        window.location.href = 'success.html';
      } else {
        throw new Error('Помилка відправки в Telegram');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      this.notification.show('Виникла помилка. Спробуйте пізніше або зателефонуйте нам.', 'error');
    } finally {
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;
    }
  }
}

/* --- components\CookieBanner.js --- */
class CookieBanner {
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

/* --- components\PromoModal.js --- */
class PromoModal {
  constructor() {
    this.BOT_TOKEN = '8986924734:AAE5TIbbb7BFEgWfyaHFov2aoKDA52UIBo8';
    this.CHAT_ID = '-1003921545216';
    this.notification = new Notification();
    this.init();
  }

  init() {
    if (sessionStorage.getItem('promoShown')) {
      return; // Already shown in this session
    }

    setTimeout(() => {
      this.createModal();
      this.open();
      sessionStorage.setItem('promoShown', 'true');
    }, 10000); // 10 seconds
  }

  createModal() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';
    this.overlay.id = 'promo-modal';
    
    this.overlay.innerHTML = `
      <div class="modal-content promo-modal-content">
        <div class="modal-close" id="promo-close">&times;</div>
        <div class="promo-badge">-15%</div>
        <h3 style="color: var(--color-primary-dark);">Знижка на перше прибирання!</h3>
        <p class="promo-text">Залиште свій номер телефону, і ми передзвонимо вам протягом 5 хвилин. За вами буде закріплено гарантовану знижку 15% на будь-яку послугу!</p>
        <form id="promo-form">
          <input type="hidden" name="subject" value="ПРОМО-ЗНИЖКА 15%">
          <div class="form-group">
            <input type="text" name="name" class="form-control" placeholder="Ваше ім'я" required>
          </div>
          <div class="form-group">
            <input type="tel" name="phone" class="form-control" placeholder="Ваш телефон" required>
          </div>
          <button type="submit" class="btn btn-primary btn-block">Отримати знижку</button>
        </form>
      </div>
    `;

    document.body.appendChild(this.overlay);

    // Event listeners
    const closeBtn = this.overlay.querySelector('#promo-close');
    closeBtn.addEventListener('click', () => this.close());

    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });

    const form = this.overlay.querySelector('#promo-form');
    form.addEventListener('submit', this.handleSubmit.bind(this));

    initPhoneInputs();

    setupRealtimeValidation(form, [
      { name: 'name', validator: validateName },
      { name: 'phone', validator: validatePhone }
    ]);
  }

  open() {
    // Small delay to allow DOM to render before adding active class for transition
    setTimeout(() => {
      this.overlay.classList.add('active');
    }, 50);
  }

  close() {
    this.overlay.classList.remove('active');
  }

  async handleSubmit(e) {
    e.preventDefault();
    const form = e.target;

    const nameInput = form.querySelector('[name="name"]');
    const phoneInput = form.querySelector('[name="phone"]');

    const nameError = validateName(nameInput.value);
    const phoneError = validatePhone(phoneInput.value);

    let hasErrors = false;
    if (nameError) {
      showError(nameInput, nameError);
      hasErrors = true;
    } else {
      clearError(nameInput);
    }

    if (phoneError) {
      showError(phoneInput, phoneError);
      hasErrors = true;
    } else {
      clearError(phoneInput);
    }

    if (hasErrors) {
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    
    const formData = new FormData(form);
    const name = formData.get('name');
    const phone = formData.get('phone');
    const subject = formData.get('subject');

    submitBtn.textContent = 'Відправка...';
    submitBtn.disabled = true;

    try {
      let message = `🎁 <b>Нова заявка на ЗНИЖКУ 15%!</b>\n\n`;
      message += `👤 <b>Ім'я:</b> ${name}\n`;
      message += `📞 <b>Телефон:</b> +380 ${phone}\n`;
      message += `🎯 <b>Джерело:</b> ${subject}\n`;

      const response = await fetch(`https://api.telegram.org/bot${this.BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: this.CHAT_ID,
          text: message,
          parse_mode: 'HTML'
        })
      });

      if (response.ok) {
        this.close();
        window.location.href = 'success.html';
      } else {
        throw new Error('Telegram API error');
      }
    } catch (error) {
      console.error(error);
      this.notification.show('Виникла помилка. Спробуйте пізніше або зателефонуйте нам.', 'error');
    } finally {
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;
    }
  }
}

/* --- App.js --- */
class App {
  constructor() {
    this.initComponents();
  }

  initComponents() {
    initPhoneInputs();
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

/* --- main.js --- */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new App();
  });
} else {
  new App();
}
