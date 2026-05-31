document.addEventListener('DOMContentLoaded', function() {
  // Initialize all features
  initTheme();
  initLanguage();
  initMobileMenu();
  initPracticeTracker();
  initDayTracker();
  initAccordion();
  initSearch();
  initCountdown();
});

// Theme Toggle
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;
  
  // Check for saved preference
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }
  
  themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

// Language Switcher
function initLanguage() {
  const langBtns = document.querySelectorAll('.lang-btn');
  if (langBtns.length === 0) return;
  
  // Get current language from URL
  const path = window.location.pathname;
  const isRussian = path.includes('/ru/');
  
  langBtns.forEach(btn => {
    const lang = btn.dataset.lang;
    if ((lang === 'ru' && isRussian) || (lang === 'en' && !isRussian)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
    
    btn.addEventListener('click', function() {
      const targetLang = this.dataset.lang;
      window.location.href = targetLang === 'ru' ? '/ru/' : '/en/';
    });
  });
}

// Mobile Menu
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (!menuBtn || !navLinks) return;
  
  menuBtn.addEventListener('click', function() {
    navLinks.classList.toggle('active');
    menuBtn.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
  });
  
  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      menuBtn.textContent = '☰';
    });
  });
}

// Practice Tracker (Daily)
function initPracticeTracker() {
  const tracker = document.getElementById('practice-tracker');
  if (!tracker) return;
  
  // Load saved state
  const saved = JSON.parse(localStorage.getItem('practice-tracker') || '{}');
  
  // Morning intention
  const morningCheck = document.getElementById('morning-check');
  const eveningCheck = document.getElementById('evening-check');
  
  if (morningCheck) {
    morningCheck.checked = saved.morning || false;
    morningCheck.addEventListener('change', function() {
      savePracticeState('morning', this.checked);
    });
  }
  
  if (eveningCheck) {
    eveningCheck.checked = saved.evening || false;
    eveningCheck.addEventListener('change', function() {
      savePracticeState('evening', this.checked);
    });
  }
  
  function savePracticeState(type, checked) {
    const saved = JSON.parse(localStorage.getItem('practice-tracker') || '{}');
    saved[type] = checked;
    localStorage.setItem('practice-tracker', JSON.stringify(saved));
  }
  
  // Reset button
  const resetBtn = document.getElementById('reset-practice');
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      localStorage.removeItem('practice-tracker');
      if (morningCheck) morningCheck.checked = false;
      if (eveningCheck) eveningCheck.checked = false;
    });
  }
}

// 30-Day Guide Tracker
function initDayTracker() {
  const dayGrid = document.getElementById('day-grid');
  if (!dayGrid) return;
  
  // Load saved progress
  const saved = JSON.parse(localStorage.getItem('day-progress') || '[]');
  
  // Create day items
  for (let i = 1; i <= 30; i++) {
    const dayItem = document.createElement('div');
    dayItem.className = 'day-item' + (saved.includes(i) ? ' completed' : '');
    dayItem.dataset.day = i;
    dayItem.innerHTML = `<span>${i}</span><small>Day</small>`;
    dayItem.addEventListener('click', function() {
      this.classList.toggle('completed');
      saveDayProgress();
    });
    dayGrid.appendChild(dayItem);
  }
  
  function saveDayProgress() {
    const completed = Array.from(document.querySelectorAll('.day-item.completed'))
      .map(el => parseInt(el.dataset.day));
    localStorage.setItem('day-progress', JSON.stringify(completed));
  }
  
  // Reset button
  const resetBtn = document.getElementById('reset-days');
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      localStorage.removeItem('day-progress');
      document.querySelectorAll('.day-item').forEach(el => el.classList.remove('completed'));
    });
  }
}

// Accordion FAQ
function initAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');
  if (accordionItems.length === 0) return;
  
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    header.addEventListener('click', function() {
      // Close others
      accordionItems.forEach(other => {
        if (other !== item) other.classList.remove('active');
      });
      // Toggle current
      item.classList.toggle('active');
    });
  });
}

// Library Search
function initSearch() {
  const searchInput = document.getElementById('library-search');
  const categoryBtns = document.querySelectorAll('.category-btn');
  const bookItems = document.querySelectorAll('.book-item');
  
  if (!searchInput || bookItems.length === 0) return;
  
  let activeCategory = 'all';
  
  function filterBooks() {
    const query = searchInput.value.toLowerCase();
    
    bookItems.forEach(item => {
      const title = item.dataset.title || '';
      const author = item.dataset.author || '';
      const category = item.dataset.category || '';
      
      const matchesSearch = title.includes(query) || author.includes(query);
      const matchesCategory = activeCategory === 'all' || category === activeCategory;
      
      item.style.display = (matchesSearch && matchesCategory) ? 'flex' : 'none';
    });
  }
  
  searchInput.addEventListener('input', filterBooks);
  
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      categoryBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      activeCategory = this.dataset.category;
      filterBooks();
    });
  });
}

// Festival Countdown
function initCountdown() {
  const countdownEl = document.getElementById('festival-countdown');
  if (!countdownEl) return;
  
  const festivals = [
    { name: 'Spring Equinox', date: '03-20' },
    { name: 'Summer Solstice', date: '06-21' },
    { name: 'Autumn Equinox', date: '09-22' },
    { name: 'Winter Solstice', date: '12-21' }
  ];
  
  function getNextFestival() {
    const now = new Date();
    const year = now.getFullYear();
    
    for (let festival of festivals) {
      const [month, day] = festival.date.split('-').map(Number);
      const festivalDate = new Date(year, month - 1, day);
      
      if (festivalDate > now) {
        return { name: festival.name, date: festivalDate };
      }
    }
    
    // Next year
    const first = festivals[0];
    const [month, day] = first.date.split('-').map(Number);
    return { name: first.name, date: new Date(year + 1, month - 1, day) };
  }
  
  function updateCountdown() {
    const now = new Date();
    const next = getNextFestival();
    const diff = next.date - now;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    document.getElementById('countdown-days').textContent = days;
    document.getElementById('countdown-hours').textContent = hours;
    document.getElementById('countdown-minutes').textContent = minutes;
    document.getElementById('festival-name').textContent = next.name;
  }
  
  updateCountdown();
  setInterval(updateCountdown, 60000);
}

// Utility: Get URL param
function getUrlParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}
