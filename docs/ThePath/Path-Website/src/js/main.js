// The Path - Website JavaScript
// Version 12.1

// Content data
const translations = {
  en: {
    home: 'Home',
    about: 'About',
    ethics: 'Ethics',
    practices: 'Practices',
    community: 'Community',
    economy: 'Economy',
    politics: 'Politics',
    education: 'Education',
    health: 'Health',
    family: 'Family',
    library: 'Library',
    stories: 'Stories',
    symbols: 'Symbols',
    festivals: 'Festivals',
    global: 'Global',
    evolution: 'Evolution',
    faq: 'FAQ',
    manifesto: 'Manifesto',
    roadmap: 'Roadmap',
    quickstart: 'Quick Start',
    resources: 'Resources',
    contact: 'Contact',
    tagline: 'Live brightly. Know boldly. Help wisely.',
    explore: 'Explore',
    startGuide: 'Start 30-Day Guide',
    downloadPdf: 'Download as PDF',
    theme: 'Toggle theme',
    lang: 'Switch language',
    backToTop: 'Back to top',
    morningIntention: 'Morning Intention',
    morningIntentionText: 'What kind of person do I want to be today?',
    eveningReflection: 'Evening Reflection',
    eveningReflectionText: 'What did I do well today?',
    practiceComplete: 'Practice completed!',
    day: 'Day',
    of: 'of',
    completed: 'Completed',
    resetProgress: 'Reset Progress',
    festivalCountdown: 'Days until',
    search: 'Search...',
    filterAll: 'All',
    filterPhilosophy: 'Philosophy',
    filterScience: 'Science',
    filterPsychology: 'Psychology',
    filterHistory: 'History',
    filterEconomics: 'Economics',
    showAnswer: 'Show answer',
    hideAnswer: 'Hide answer',
    communityMap: 'Community Map',
    mapPlaceholder: 'Interactive map coming soon. Join our community to be added.'
  },
  ru: {
    home: 'Главная',
    about: 'О Path',
    ethics: 'Этика',
    practices: 'Практики',
    community: 'Сообщество',
    economy: 'Экономика',
    politics: 'Политика',
    education: 'Образование',
    health: 'Здоровье',
    family: 'Семья',
    library: 'Библиотека',
    stories: 'Истории',
    symbols: 'Символы',
    festivals: 'Праздники',
    global: 'Глобальная',
    evolution: 'Эволюция',
    faq: 'FAQ',
    manifesto: 'Манифест',
    roadmap: 'План',
    quickstart: 'Старт',
    resources: 'Ресурсы',
    contact: 'Контакт',
    tagline: 'Живи ярко. Познавай смело. Помогай мудро.',
    explore: 'Исследовать',
    startGuide: 'Начать 30-дневный курс',
    downloadPdf: 'Скачать PDF',
    theme: 'Переключить тему',
    lang: 'Сменить язык',
    backToTop: 'Наверх',
    morningIntention: 'Утреннее намерение',
    morningIntentionText: 'Каким человеком я хочу быть сегодня?',
    eveningReflection: 'Вечернее размышление',
    eveningReflectionText: 'Что я сделал хорошо сегодня?',
    practiceComplete: 'Практика выполнена!',
    day: 'День',
    of: 'из',
    completed: 'Завершено',
    resetProgress: 'Сбросить прогресс',
    festivalCountdown: 'Дней до',
    search: 'Поиск...',
    filterAll: 'Все',
    filterPhilosophy: 'Философия',
    filterScience: 'Наука',
    filterPsychology: 'Психология',
    filterHistory: 'История',
    filterEconomics: 'Экономика',
    showAnswer: 'Показать ответ',
    hideAnswer: 'Скрыть ответ',
    communityMap: 'Карта сообществ',
    mapPlaceholder: 'Интерактивная карта скоро появится. Присоединяйтесь к сообществу.'
  }
};

// State
let currentLang = localStorage.getItem('lang') || 'en';
let currentTheme = localStorage.getItem('theme') || 'light';
let practiceState = JSON.parse(localStorage.getItem('practiceState')) || {
  morning: false,
  evening: false,
  lastDate: null
};
let guideState = JSON.parse(localStorage.getItem('guideState')) || {};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLanguage();
  initNavigation();
  initPracticeTracker();
  initFAQ();
  initGuide();
  initCountdown();
  initScrollTop();
});

// Theme
function initTheme() {
  document.documentElement.setAttribute('data-theme', currentTheme);
  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
    btn.setAttribute('aria-label', translations[currentLang].theme);
  }
}

function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  localStorage.setItem('theme', currentTheme);
  initTheme();
}

// Language
function initLanguage() {
  document.documentElement.lang = currentLang;
  updateTranslations();
  const btn = document.getElementById('langToggle');
  if (btn) {
    btn.textContent = currentLang === 'en' ? 'RU' : 'EN';
  }
}

function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'ru' : 'en';
  localStorage.setItem('lang', currentLang);
  initLanguage();
  updatePageContent();
}

function updateTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[currentLang][key]) {
      el.textContent = translations[currentLang][key];
    }
  });
}

// Navigation
function initNavigation() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
  
  // Update active nav link
  const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href').replace('.html', '');
    if (href === currentPage || (currentPage === '' && href === 'index')) {
      link.classList.add('active');
    }
  });
}

// Practice Tracker
function initPracticeTracker() {
  const tracker = document.getElementById('practiceTracker');
  if (!tracker) return;
  
  const today = new Date().toDateString();
  if (practiceState.lastDate !== today) {
    practiceState.morning = false;
    practiceState.evening = false;
    practiceState.lastDate = today;
  }
  
  const morningCheckbox = document.getElementById('morningCheck');
  const eveningCheckbox = document.getElementById('eveningCheck');
  
  if (morningCheckbox) {
    morningCheckbox.checked = practiceState.morning;
    morningCheckbox.addEventListener('change', () => {
      practiceState.morning = morningCheckbox.checked;
      savePracticeState();
    });
  }
  
  if (eveningCheckbox) {
    eveningCheckbox.checked = practiceState.evening;
    eveningCheckbox.addEventListener('change', () => {
      practiceState.evening = eveningCheckbox.checked;
      savePracticeState();
    });
  }
}

function savePracticeState() {
  localStorage.setItem('practiceState', JSON.stringify(practiceState));
}

// FAQ
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isActive = item.classList.contains('active');
      
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

// 30-Day Guide
function initGuide() {
  const guide = document.getElementById('guideGrid');
  if (!guide) return;
  
  const days = guide.querySelectorAll('.day-btn');
  
  days.forEach((day, index) => {
    const dayNum = index + 1;
    if (guideState[dayNum]) {
      day.classList.add('completed');
    }
    
    day.addEventListener('click', () => {
      showGuideDay(dayNum);
    });
  });
  
  // Check for current day
  const currentDay = new Date().getDate();
  if (currentDay <= 30) {
    const currentBtn = days[currentDay - 1];
    if (currentBtn) currentBtn.classList.add('current');
  }
}

function showGuideDay(dayNum) {
  const days = document.querySelectorAll('.day-btn');
  days.forEach(d => d.classList.remove('active'));
  
  const contents = document.querySelectorAll('.day-content');
  contents.forEach(c => c.classList.remove('active'));
  
  days[dayNum - 1].classList.add('active');
  const content = document.getElementById(`day-${dayNum}-content`);
  if (content) content.classList.add('active');
  
  guideState[dayNum] = true;
  localStorage.setItem('guideState', JSON.stringify(guideState));
  days[dayNum - 1].classList.add('completed');
}

function resetGuide() {
  guideState = {};
  localStorage.setItem('guideState', JSON.stringify(guideState));
  document.querySelectorAll('.day-btn').forEach(d => d.classList.remove('completed', 'active'));
}

// Festival Countdown
function initCountdown() {
  const countdown = document.getElementById('festivalCountdown');
  if (!countdown) return;
  
  const festivals = [
    { name: 'Spring Equinox', month: 3, day: 20 },
    { name: 'Summer Solstice', month: 6, day: 21 },
    { name: 'Autumn Equinox', month: 9, day: 22 },
    { name: 'Winter Solstice', month: 12, day: 21 }
  ];
  
  const now = new Date();
  const currentYear = now.getFullYear();
  
  let nextFestival = null;
  let daysUntil = Infinity;
  
  festivals.forEach(f => {
    let date = new Date(currentYear, f.month - 1, f.day);
    if (date < now) {
      date = new Date(currentYear + 1, f.month - 1, f.day);
    }
    const diff = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
    if (diff < daysUntil) {
      daysUntil = diff;
      nextFestival = f;
    }
  });
  
  if (nextFestival) {
    countdown.innerHTML = `
      <div class="countdown-item">
        <div class="number">${daysUntil}</div>
        <div class="label">${translations[currentLang].festivalCountdown} ${nextFestival.name}</div>
      </div>
    `;
  }
}

// Scroll to top
function initScrollTop() {
  const btn = document.createElement('button');
  btn.className = 'scroll-top';
  btn.innerHTML = '↑';
  btn.setAttribute('aria-label', translations[currentLang].backToTop);
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  document.body.appendChild(btn);
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.style.display = 'block';
    } else {
      btn.style.display = 'none';
    }
  });
}

// Page content update (for language switch)
function updatePageContent() {
  updateTranslations();
  // Re-init components that depend on language
  initCountdown();
}

// Search functionality
function initSearch() {
  const searchInput = document.getElementById('librarySearch');
  if (!searchInput) return;
  
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.book-card');
    
    cards.forEach(card => {
      const title = card.querySelector('h4').textContent.toLowerCase();
      const author = card.querySelector('.author').textContent.toLowerCase();
      if (title.includes(query) || author.includes(query)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

// Filter functionality
function initFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const cards = document.querySelectorAll('.book-card');
      cards.forEach(card => {
        const category = card.getAttribute('data-category') || card.querySelector('.category').textContent.toLowerCase();
        if (filter === 'all' || category.includes(filter.toLowerCase())) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// Filter books (called from HTML)
function filterBooks() {
  const searchInput = document.getElementById('librarySearch');
  if (!searchInput) return;
  
  const query = searchInput.value.toLowerCase();
  const cards = document.querySelectorAll('.book-card');
  const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
  
  cards.forEach(card => {
    const title = card.querySelector('h4').textContent.toLowerCase();
    const author = card.querySelector('.author').textContent.toLowerCase();
    const category = card.getAttribute('data-category') || '';
    
    const matchesSearch = title.includes(query) || author.includes(query);
    const matchesFilter = activeFilter === 'all' || category === activeFilter;
    
    if (matchesSearch && matchesFilter) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Make functions global
window.toggleTheme = toggleTheme;
window.toggleLanguage = toggleLanguage;
window.resetGuide = resetGuide;
window.filterBooks = filterBooks;
window.showGuideDay = showGuideDay;