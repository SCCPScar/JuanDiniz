// Menu mobile (hambúrguer)
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const nav = navToggle ? navToggle.closest('nav') : null;

if (navToggle && navLinks && nav) {
  function fecharMenu() {
    nav.classList.remove('menu-open');
    navToggle.classList.remove('is-active');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  function alternarMenu() {
    const aberto = nav.classList.toggle('menu-open');
    navToggle.classList.toggle('is-active', aberto);
    navToggle.setAttribute('aria-expanded', String(aberto));
  }

  navToggle.addEventListener('click', alternarMenu);

  // Fecha o menu ao clicar num link (útil em ecrãs pequenos)
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', fecharMenu);
  });

  // Fecha o menu ao clicar em Entrar/Registar/Terminar sessão
  nav.querySelectorAll('.nav-auth a, .nav-auth button').forEach((el) => {
    el.addEventListener('click', fecharMenu);
  });

  // Fecha o menu com a tecla Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') fecharMenu();
  });
}