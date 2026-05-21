// Hamburger menu
function toggleMenu() {
  const btn = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  btn.classList.toggle('open');
  links.classList.toggle('open');
}

// Luk menu når man klikker et link
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      document.getElementById('hamburger')?.classList.remove('open');
      document.getElementById('nav-links')?.classList.remove('open');
    });
  });
});

// Sticky nav shadow
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// Scroll to top button
const scrollTopBtn = document.getElementById('scroll-top-btn');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    const filters = document.getElementById('menu-filters');
    const threshold = filters
      ? filters.getBoundingClientRect().bottom + window.scrollY + 200
      : 400;
    scrollTopBtn.classList.toggle('visible', window.scrollY > threshold);
  });
}

// Scroll animations håndteres af content-loader.js → observeFadeUps()

// Menu filter
function filterMenu(category, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.querySelectorAll('.menu-section').forEach(section => {
    if (category === 'all' || section.dataset.category === category) {
      section.style.display = '';
    } else {
      section.style.display = 'none';
    }
  });
}

// Contact form
function handleSubmit(e) {
  e.preventDefault();
  document.getElementById('form-success').style.display = 'block';
  e.target.reset();
}
