import { Notification } from './Notification.js?v=2.0';

export class PromoModal {
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
    
    this.overlay.innerHTML = \
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
    \;

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
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    
    const formData = new FormData(form);
    const name = formData.get('name');
    const phone = formData.get('phone');
    const subject = formData.get('subject');

    submitBtn.textContent = 'Відправка...';
    submitBtn.disabled = true;

    try {
      let message = \🎁 <b>Нова заявка на ЗНИЖКУ 15%!</b>\n\n\;
      message += \👤 <b>Ім'я:</b> \\n\;
      message += \📞 <b>Телефон:</b> \\n\;
      message += \🎯 <b>Джерело:</b> \\n\;

      const response = await fetch(\https://api.telegram.org/bot\/sendMessage\, {
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