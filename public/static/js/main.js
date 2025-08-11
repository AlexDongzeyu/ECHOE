// Navigation and mobile menu behavior matching Flask base.html
function toggleMobileMenu() {
  const menu = document.getElementById('nav-menu');
  if (menu) menu.classList.toggle('show');
}

document.addEventListener('click', function (event) {
  const nav = document.querySelector('nav');
  const menu = document.getElementById('nav-menu');
  const toggle = document.querySelector('.mobile-menu-toggle');
  if (!nav || !menu || !toggle) return;
  if (!nav.contains(event.target) || (!toggle.contains(event.target) && !menu.contains(event.target))) {
    menu.classList.remove('show');
  }
});

window.addEventListener('resize', function () {
  const menu = document.getElementById('nav-menu');
  if (window.innerWidth > 768 && menu) {
    menu.classList.remove('show');
  }
});
// This is a placeholder for the main JavaScript file. 