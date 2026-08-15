// theme toggle: light/dark, respects system preference, remembers choice
(function () {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeToggleMobile = document.getElementById('themeToggleMobile');

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    const isDark = theme === 'dark';
    [themeToggle, themeToggleMobile].forEach(btn => {
      if (!btn) return;
      btn.setAttribute('aria-pressed', String(isDark));
      btn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
      const label = btn.querySelector('span');
      if (label) label.textContent = isDark ? 'Switch to light theme' : 'Switch to dark theme';
    });
  }

  function toggleTheme() {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('bt-theme', next);
  }

  const stored = localStorage.getItem('bt-theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(stored || (systemDark ? 'dark' : 'light'));

  themeToggle && themeToggle.addEventListener('click', toggleTheme);
  themeToggleMobile && themeToggleMobile.addEventListener('click', toggleTheme);
})();

document.getElementById('year').textContent = new Date().getFullYear();

// mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');
navToggle.addEventListener('click', () => {
  const open = navMobile.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});
navMobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navMobile.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}));

// contact form -> Web3Forms (static-site friendly, no backend required)
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
const submitBtn = form.querySelector('.form-submit');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // honeypot: if filled, silently drop (bot submission)
  if (form.botcheck.checked) return;

  const key = form.access_key.value;
  if (!key || key === 'YOUR_WEB3FORMS_ACCESS_KEY') {
    note.style.color = '#C0392B';
    note.textContent = 'Form isn\u2019t connected yet \u2014 add your Web3Forms access key in index.html.';
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';
  note.style.color = '';
  note.textContent = '';

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    const result = await res.json();

    if (result.success) {
      form.reset();
      note.textContent = 'Thanks — your message has been sent. I\u2019ll get back to you shortly.';
    } else {
      throw new Error(result.message || 'Submission failed');
    }
  } catch (err) {
    note.style.color = '#C0392B';
    note.textContent = 'Something went wrong sending that. Please try again, or email directly.';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send message';
  }
});
