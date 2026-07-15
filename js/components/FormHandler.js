import { Notification } from './Notification.js';

export class FormHandler {
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
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

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
      message += `📞 <b>Телефон:</b> ${phone}\n`;
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
