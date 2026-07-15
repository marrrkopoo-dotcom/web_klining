export class Notification {
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
