document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
});
function getGreeting(date = new Date()) {
  const h = date.getHours();
  return h < 12 ? 'Good morning' : (h < 18 ? 'Good afternoon' : 'Good evening');
}

(function initGreeting() {
  const el = document.getElementById('greeting');
  if (!el) return;

  function render() {
    el.textContent = getGreeting(new Date());
  }

  render();

  // update at the next minute boundary, then every minute
  const now = new Date();
  const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
  setTimeout(() => {
    render();
    setInterval(render, 60_000);
  }, msUntilNextMinute);
})();

// --- Timer/Counter: Time on site ---
let secondsOnSite = 0;
const timerEl = document.getElementById('site-timer');
if (timerEl) {
  setInterval(() => {
    secondsOnSite++;
    let s = secondsOnSite;
    const h = Math.floor(s / 3600);
    s %= 3600;
    const m = Math.floor(s / 60);
    s = s % 60;
    let out = '';
    if (h > 0) out += h + 'h ';
    if (m > 0 || h > 0) out += m + 'm ';
    out += s + 's';
    timerEl.textContent = out;
  }, 1000);
}

// --- State Management Features ---
document.addEventListener('DOMContentLoaded', function () {
  // Light/Dark Mode
  const themeBtn = document.getElementById('theme-toggle');
  const body = document.body;
  function setTheme(mode) {
    if (mode === 'light') {
      body.classList.add('light-mode');
      themeBtn.textContent = '☀️ Light Mode';
    } else {
      body.classList.remove('light-mode');
      themeBtn.textContent = '🌙 Dark Mode';
    }
    localStorage.setItem('theme', mode);
  }
  if (themeBtn) {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    themeBtn.addEventListener('click', function () {
      setTheme(body.classList.contains('light-mode') ? 'dark' : 'light');
    });
  }

  // Show/Hide Projects with animation
  const projects = document.getElementById('Projects');
  const toggleProjectsBtn = document.getElementById('toggle-projects-btn');
  function setProjectsVisible(visible) {
    if (projects) {
      if (visible) {
        projects.classList.remove('hide');
        setTimeout(() => { projects.style.display = ''; }, 500);
      } else {
        projects.classList.add('hide');
        setTimeout(() => { projects.style.display = 'none'; }, 500);
      }
    }
    if (toggleProjectsBtn) toggleProjectsBtn.textContent = visible ? 'Hide Projects' : 'Show Projects';
    localStorage.setItem('showProjects', visible ? '1' : '0');
  }
  if (toggleProjectsBtn) {
    const show = localStorage.getItem('showProjects') !== '0';
    if (!show && projects) {
      projects.classList.add('hide');
      projects.style.display = 'none';
    }
    toggleProjectsBtn.textContent = show ? 'Hide Projects' : 'Show Projects';
    toggleProjectsBtn.addEventListener('click', function () {
      setProjectsVisible(projects.classList.contains('hide'));
    });
  }

  // Personalized Greeting (remember name)
  const nameEl = document.getElementById('name');
  const personalGreeting = document.getElementById('personal-greeting');
  function updatePersonalGreeting() {
    const storedName = localStorage.getItem('visitorName');
    if (personalGreeting) {
      if (storedName && storedName.length > 1) {
        personalGreeting.textContent = `Welcome back, ${storedName}! 👋`;
      } else {
        personalGreeting.textContent = '';
      }
    }
  }
  if (nameEl) {
    nameEl.addEventListener('blur', function () {
      if (nameEl.value.trim().length > 1) {
        localStorage.setItem('visitorName', nameEl.value.trim());
        updatePersonalGreeting();
      }
    });
    // On load, prefill name if available
    const storedName = localStorage.getItem('visitorName');
    if (storedName && storedName.length > 1) {
      nameEl.value = storedName;
    }
    updatePersonalGreeting();
  }


});

// --- Enhanced Contact Form Validation (real-time + email confirmation) ---
document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('#form form');
  if (!form) return;
  const nameEl = document.getElementById('name');
  const emailEl = document.getElementById('email');
  const confirmEmailEl = document.getElementById('confirm-email');
  const messageEl = document.getElementById('message');
  const submitBtn = form.querySelector('button[type="submit"]');

  function validateField(el) {
    if (!el) return '';
    if (el === nameEl && el.value.trim().length < 2) return 'Please enter your name (at least 2 characters).';
    if (el === emailEl && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim())) return 'Please enter a valid email address.';
    if (el === confirmEmailEl && el.value.trim() !== emailEl.value.trim()) return 'Emails do not match.';
    if (el === messageEl && el.value.trim().length < 5) return 'Please enter a message (at least 5 characters).';
    return '';
  }

  [nameEl, emailEl, confirmEmailEl, messageEl].forEach(el => {
    if (!el) return;
    el.addEventListener('input', function () {
      const err = validateField(el);
      let errEl = document.getElementById('err-' + el.id);
      if (err) {
        if (!errEl) {
          errEl = document.createElement('div');
          errEl.id = 'err-' + el.id;
          errEl.className = 'error';
          errEl.style.color = 'crimson';
          errEl.style.fontSize = '0.9em';
          errEl.style.marginTop = '4px';
          el.parentNode.insertBefore(errEl, el.nextSibling);
        }
        errEl.textContent = err;
        el.setAttribute('aria-invalid', 'true');
      } else if (errEl) {
        errEl.remove();
        el.removeAttribute('aria-invalid');
      }
    });
  });

  form.addEventListener('submit', function (e) {
    let valid = true;
    [nameEl, emailEl, confirmEmailEl, messageEl].forEach(el => {
      const err = validateField(el);
      let errEl = document.getElementById('err-' + el.id);
      if (err) {
        if (!errEl) {
          errEl = document.createElement('div');
          errEl.id = 'err-' + el.id;
          errEl.className = 'error';
          errEl.style.color = 'crimson';
          errEl.style.fontSize = '0.9em';
          errEl.style.marginTop = '4px';
          el.parentNode.insertBefore(errEl, el.nextSibling);
        }
        errEl.textContent = err;
        el.setAttribute('aria-invalid', 'true');
        valid = false;
      } else if (errEl) {
        errEl.remove();
        el.removeAttribute('aria-invalid');
      }
    });
    if (!valid) {
      e.preventDefault();
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
    }
  });
});

// contact form validation + confirmation message
(function initContactValidation() {
  const form = document.querySelector('#form form');
  if (!form) return;

  // cache references
  const nameEl = document.getElementById('name');
  const emailEl = document.getElementById('email');
  const messageEl = document.getElementById('message');
  const submitBtn = form.querySelector('button[type="submit"]');

  function clearErrors() {
    // remove error nodes and aria attributes
    form.querySelectorAll('.error').forEach(e => e.remove());
    [nameEl, emailEl, messageEl].forEach(el => {
      if (!el) return;
      el.removeAttribute('aria-describedby');
      el.removeAttribute('aria-invalid');
    });
  }

  function showError(el, text) {
    const id = `err-${el.id}`;
    // remove old error if present
    const old = document.getElementById(id);
    if (old) old.remove();

    const d = document.createElement('div');
    d.className = 'error';
    d.id = id;
    d.style.color = 'crimson';
    d.style.fontSize = '0.9em';
    d.style.marginTop = '4px';
    d.textContent = text;
    // associate error with input for screen readers
    el.setAttribute('aria-describedby', id);
    el.setAttribute('aria-invalid', 'true');
    el.parentNode.insertBefore(d, el.nextSibling);
  }

  function showConfirmation(text) {
    let c = document.getElementById('confirmation');
    if (!c) {
      c = document.createElement('div');
      c.id = 'confirmation';
      // accessible status for screen readers
      c.setAttribute('role', 'status');
      c.setAttribute('aria-live', 'polite');
      c.style.background = '#e6ffed';
      c.style.border = '1px solid #0f9d58';
      c.style.padding = '10px';
      c.style.marginBottom = '10px';
      c.style.borderRadius = '4px';
      c.style.color = '#0b6623';
    }
    c.textContent = text;
    form.parentNode.insertBefore(c, form);
    setTimeout(() => c.remove(), 5000);
  }

  function showLoading() {
    let loadingEl = document.getElementById('form-loading');
    if (!loadingEl) {
      loadingEl = document.createElement('div');
      loadingEl.id = 'form-loading';
      loadingEl.setAttribute('role', 'status');
      loadingEl.setAttribute('aria-live', 'polite');
      loadingEl.style.marginBottom = '10px';
      loadingEl.style.padding = '8px';
      loadingEl.style.background = '#fff8e1';
      loadingEl.style.border = '1px solid #ffd54f';
      loadingEl.style.borderRadius = '4px';
      loadingEl.style.color = '#8a6d00';
      loadingEl.style.fontWeight = '600';
      // simple spinner + text
      loadingEl.innerHTML = '<span aria-hidden="true">⏳</span> Loading...';
    }
    form.parentNode.insertBefore(loadingEl, form);
    // announce busy state
    form.setAttribute('aria-busy', 'true');
    submitBtn.setAttribute('aria-disabled', 'true');
    [nameEl, emailEl, messageEl, submitBtn].forEach(el => el.disabled = true);
  }

  function hideLoading() {
    const loadingEl = document.getElementById('form-loading');
    if (loadingEl) loadingEl.remove();
    form.removeAttribute('aria-busy');
    submitBtn.removeAttribute('aria-disabled');
    [nameEl, emailEl, messageEl, submitBtn].forEach(el => el.disabled = false);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();

    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const message = messageEl.value.trim();

    let valid = true;
    if (name.length < 2) {
      showError(nameEl, 'Please enter your name (at least 2 characters).');
      valid = false;
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      showError(emailEl, 'Please enter a valid email address.');
      valid = false;
    }

    if (message.length < 5) {
      showError(messageEl, 'Please enter a message (at least 5 characters).');
      valid = false;
    }

    if (!valid) {
      // focus first invalid field for keyboard/screen reader users
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // show artificial loading state for 3 seconds (accessible)
    showLoading();

    setTimeout(() => {
      hideLoading();
      showConfirmation('Thanks — your message has been sent. I will get back to you soon.');
      form.reset();
      // move focus to confirmation if present
      const c = document.getElementById('confirmation');
      if (c) c.focus?.();
    }, 3000);
  });
})();

// --- Weather and Quote API Integration ---
document.addEventListener('DOMContentLoaded', function () {
  // WEATHER API (Open-Meteo, no key required)
  const weatherInfo = document.getElementById('weather-info');
  if (weatherInfo) {
    // Dhahran, Saudi Arabia (lat: 26.2361, lon: 50.0393)
    const lat = 26.2361, lon = 50.0393;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    fetch(url)
      .then(r => r.ok ? r.json() : Promise.reject(r))
      .then(data => {
        if (data.current_weather) {
          const w = data.current_weather;
          weatherInfo.innerHTML = `
            <strong>${w.temperature}&deg;C</strong>, ${weatherDescription(w.weathercode)}<br>
            <span style="font-size:0.9em;">Wind: ${w.windspeed} km/h</span>
          `;
        } else {
          weatherInfo.textContent = 'Weather data unavailable.';
        }
      })
      .catch(() => {
        weatherInfo.textContent = 'Unable to fetch weather. Please try again later.';
      });
  }

  // QUOTE API with fallback options
  const quoteInfo = document.getElementById('quote-info');
  if (quoteInfo) {
    // Try multiple quote APIs with fallbacks
    const quoteAPIs = [
      {
        url: 'https://api.quotable.io/random',
        parse: (data) => ({ content: data.content, author: data.author })
      },
      {
        url: 'https://zenquotes.io/api/random',
        parse: (data) => ({ content: data[0].q, author: data[0].a })
      },
      {
        url: 'https://api.adviceslip.com/advice',
        parse: (data) => ({ content: data.slip.advice, author: 'Advice Slip' })
      }
    ];

    async function fetchQuote(apiIndex = 0) {
      if (apiIndex >= quoteAPIs.length) {
        quoteInfo.innerHTML = `"The only way to do great work is to love what you do."<br><span style="font-size:0.9em;">— Steve Jobs</span>`;
        return;
      }

      try {
        const api = quoteAPIs[apiIndex];
        const response = await fetch(api.url);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        const quote = api.parse(data);
        
        if (quote.content && quote.author) {
          quoteInfo.innerHTML = `"${quote.content}"<br><span style="font-size:0.9em;">— ${quote.author}</span>`;
        } else {
          throw new Error('Invalid quote data');
        }
      } catch (error) {
        console.log(`Quote API ${apiIndex + 1} failed:`, error);
        fetchQuote(apiIndex + 1);
      }
    }

    fetchQuote();
  }
});

// Helper for weather code to description (Open-Meteo)
function weatherDescription(code) {
  const map = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Depositing rime fog',
    51: 'Light drizzle', 53: 'Drizzle', 55: 'Dense drizzle',
    56: 'Freezing drizzle', 57: 'Dense freezing drizzle',
    61: 'Slight rain', 63: 'Rain', 65: 'Heavy rain',
    66: 'Freezing rain', 67: 'Heavy freezing rain',
    71: 'Slight snow', 73: 'Snow', 75: 'Heavy snow',
    77: 'Snow grains', 80: 'Slight rain showers', 81: 'Rain showers', 82: 'Violent rain showers',
    85: 'Slight snow showers', 86: 'Heavy snow showers',
    95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Thunderstorm with heavy hail'
  };
  return map[code] || 'Unknown';
}