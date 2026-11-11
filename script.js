const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');

toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});

nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open navigation');
}));

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && !reduceMotion) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -35px 0px' });

  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}

// Scroll-led opening: the oversized name rises away as the next section comes into view.
const heroStage = document.querySelector('.hero-stage');
const heroName = document.querySelector('.hero-name-layer');
const progress = document.querySelector('.scroll-progress');
let framePending = false;

function blendColor(from, to, amount) {
  return from.map((value, index) => Math.round(value + (to[index] - value) * amount));
}

function updateOnScroll() {
  const blend = Math.min(1, Math.max(0, window.scrollY / 420));

  if (heroStage) {
    // Both ends stay light: soft sage-grey into the site's warm ivory.
    const [r, g, b] = blendColor([217, 217, 207], [244, 240, 232], blend);
    heroStage.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  }

  if (heroName && !reduceMotion) {
    const lift = Math.min(1, Math.max(0, window.scrollY / 480));
    heroName.style.transform = `translate(-50%, ${-lift * 58}%)`;
    heroName.style.opacity = String(1 - lift * 0.82);
  }

  if (progress) {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${maxScroll > 0 ? Math.min(1, window.scrollY / maxScroll) : 0})`;
  }
  framePending = false;
}

window.addEventListener('scroll', () => {
  if (!framePending) {
    window.requestAnimationFrame(updateOnScroll);
    framePending = true;
  }
}, { passive: true });

updateOnScroll();

if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduceMotion) {
  document.querySelectorAll('.project-visual').forEach(visual => {
    visual.addEventListener('pointermove', event => {
      const rect = visual.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      visual.style.transform = `perspective(900px) rotateY(${x * 2.2}deg) rotateX(${-y * 2.2}deg)`;
    });
    visual.addEventListener('pointerleave', () => visual.style.transform = '');
  });
}
