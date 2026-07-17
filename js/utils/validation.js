export function validateName(name) {
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return 'Ім\'я повинно містити щонайменше 2 символи';
  }
  // Allow letters (Latin + Cyrillic including Ukrainian extension letters), spaces, dashes, apostrophes
  const nameRegex = /^[a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ\s'-]+$/;
  if (!nameRegex.test(trimmed)) {
    return 'Ім\'я повинно містити тільки літери';
  }
  return null;
}

export function validatePhone(phone) {
  // Strip spaces, dashes, parentheses, and plus sign
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  // Must match Ukrainian format: 0 followed by 9 digits, or 380 followed by 9 digits
  const phoneRegex = /^(38)?0\d{9}$/;
  if (!phoneRegex.test(cleaned)) {
    return 'Невірний формат телефону. Приклад: +380991234567';
  }
  return null;
}

export function showError(inputElement, message) {
  inputElement.classList.add('invalid');
  let errorDiv = inputElement.parentNode.querySelector('.error-message');
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    inputElement.parentNode.appendChild(errorDiv);
  }
  errorDiv.textContent = message;
}

export function clearError(inputElement) {
  inputElement.classList.remove('invalid');
  const errorDiv = inputElement.parentNode.querySelector('.error-message');
  if (errorDiv) {
    errorDiv.remove();
  }
}

export function setupRealtimeValidation(form, fields) {
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
