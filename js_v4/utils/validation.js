export function validateName(name) {
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

export function validatePhone(phone) {
  // Extract only digits
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length !== 9) {
    return 'Введіть номер повністю: (XX) XXX-XX-XX';
  }
  return null;
}

export function showError(inputElement, message) {
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

export function clearError(inputElement) {
  const wrapper = inputElement.closest('.phone-input-wrapper') || inputElement;
  inputElement.classList.remove('invalid');
  const errorDiv = wrapper.parentNode.querySelector('.error-message');
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

export function initPhoneInputs() {
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
