const mobileMenuBtnElement = document.getElementById('mobile-menu-btn');
const mobileMenuElement = document.getElementById('mobile-menu');

mobileMenuBtnElement.addEventListener('click', () => {
  mobileMenuElement.classList.toggle('open');
});
