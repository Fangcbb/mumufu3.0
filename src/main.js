import './styles.css';
import { allImages, projectsWithCount } from './data/mock-projects.js';

const app = document.querySelector('#app');

const state = {
  route: 'selected',
  theme: localStorage.getItem('studio-theme') || 'light',
  mobileMenuOpen: false,
  lightboxOpen: false,
  lightboxImages: [],
  lightboxIndex: 0,
  touchStartX: 0,
  touchEndX: 0
};

const normalizeRoute = () => {
  const hash = window.location.hash.replace('#', '').trim();
  if (['selected', 'catalogue', 'info'].includes(hash)) {
    return hash;
  }
  return 'selected';
};

const setTheme = (theme) => {
  state.theme = theme;
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('studio-theme', theme);
};

const openLightbox = (images, index) => {
  state.lightboxOpen = true;
  state.lightboxImages = images;
  state.lightboxIndex = index;
  render();
};

const closeLightbox = () => {
  state.lightboxOpen = false;
  render();
};

const nextImage = () => {
  const len = state.lightboxImages.length;
  state.lightboxIndex = (state.lightboxIndex + 1 + len) % len;
  render();
};

const prevImage = () => {
  const len = state.lightboxImages.length;
  state.lightboxIndex = (state.lightboxIndex - 1 + len) % len;
  render();
};

const selectedMarkup = () => {
  const sections = projectsWithCount
    .map((project, projectIndex) => {
      const imageCells = project.images
        .map((image, imageIndex) => {
          return `<button class="image-tile ${image.orientation}" data-open-project="${projectIndex}" data-open-index="${imageIndex}" aria-label="Open ${image.alt}">
            <img src="${image.src}" alt="${image.alt}" loading="lazy" />
          </button>`;
        })
        .join('');

      return `<section class="project-block">
        <header class="project-header">
          <p class="project-index">[ ${String(projectIndex + 1).padStart(2, '0')} ]</p>
          <div>
            <h2>${project.title} <span>[ ${project.count} ]</span></h2>
            <p>${project.description}</p>
          </div>
        </header>
        <div class="selected-grid">${imageCells}</div>
      </section>`;
    })
    .join('');

  return `<main class="page selected-page">${sections}</main>`;
};

const catalogueMarkup = () => {
  const list = allImages
    .map(
      (image, index) => `<button class="catalogue-item ${image.orientation}" data-open-catalogue="${index}" aria-label="Open ${image.alt}">
      <img src="${image.src}" alt="${image.alt}" loading="lazy" />
      <span>${image.globalIndex}</span>
    </button>`
    )
    .join('');

  return `<main class="page catalogue-page">
    <header class="catalogue-header">
      <p>Catalogue</p>
      <small>${allImages.length} images / ${projectsWithCount.length} projects</small>
    </header>
    <div class="catalogue-grid">${list}</div>
  </main>`;
};

const infoMarkup = () => `<main class="page info-page">
  <section>
    <p class="label">Profile</p>
    <h1>Yun Mu Studio</h1>
    <p class="lead">
      Commercial photography studio focused on quiet image systems for fashion, objects, and editorial commissions.
      We build restrained visual narratives with precise lighting, spacing, and texture.
    </p>
  </section>
  <section class="info-columns">
    <div>
      <p class="label">Services</p>
      <ul>
        <li>Campaign Photography</li>
        <li>Art Direction</li>
        <li>Still Life & Product</li>
        <li>Portrait & Casting</li>
        <li>Visual Identity Imagery</li>
      </ul>
    </div>
    <div>
      <p class="label">Contact</p>
      <p>hello@yunmustudio.com</p>
      <p>+1 212 555 0199</p>
      <p>New York / Remote Worldwide</p>
    </div>
    <div>
      <p class="label">Social</p>
      <p><a href="#" aria-label="Instagram link placeholder">Instagram</a></p>
      <p><a href="#" aria-label="Behance link placeholder">Behance</a></p>
      <p><a href="#" aria-label="Are.na link placeholder">Are.na</a></p>
    </div>
  </section>
</main>`;

const lightboxMarkup = () => {
  if (!state.lightboxOpen) return '';
  const current = state.lightboxImages[state.lightboxIndex];
  return `<div class="lightbox" role="dialog" aria-modal="true">
    <button class="lightbox-close" data-lightbox-close aria-label="Close">Close</button>
    <button class="lightbox-nav prev" data-lightbox-prev aria-label="Previous">‹</button>
    <figure class="lightbox-frame">
      <img src="${current.src}" alt="${current.alt}" />
      <figcaption>${current.alt}</figcaption>
    </figure>
    <button class="lightbox-nav next" data-lightbox-next aria-label="Next">›</button>
  </div>`;
};

const pageMarkup = () => {
  if (state.route === 'catalogue') return catalogueMarkup();
  if (state.route === 'info') return infoMarkup();
  return selectedMarkup();
};

const render = () => {
  setTheme(state.theme);
  app.innerHTML = `
    <div class="site-shell">
      <header class="topbar">
        <a class="brand" href="#selected">Monochrome Studio</a>
        <button class="mobile-menu-button" data-mobile-toggle aria-label="Toggle navigation">Menu</button>
        <nav class="nav ${state.mobileMenuOpen ? 'open' : ''}" aria-label="Primary">
          <a href="#selected" class="${state.route === 'selected' ? 'active' : ''}">Selected</a>
          <a href="#catalogue" class="${state.route === 'catalogue' ? 'active' : ''}">Catalogue</a>
          <a href="#info" class="${state.route === 'info' ? 'active' : ''}">Info</a>
          <button class="theme-toggle" data-theme-toggle aria-label="Toggle theme">${state.theme === 'light' ? 'Dark' : 'Light'}</button>
        </nav>
      </header>
      ${pageMarkup()}
      ${lightboxMarkup()}
    </div>
  `;

  bindEvents();
};

const bindEvents = () => {
  document.querySelector('[data-mobile-toggle]')?.addEventListener('click', () => {
    state.mobileMenuOpen = !state.mobileMenuOpen;
    render();
  });

  document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
    setTheme(state.theme === 'light' ? 'dark' : 'light');
    render();
  });

  document.querySelectorAll('[data-open-project]').forEach((button) => {
    button.addEventListener('click', (event) => {
      const projectIndex = Number(event.currentTarget.dataset.openProject);
      const imageIndex = Number(event.currentTarget.dataset.openIndex);
      openLightbox(projectsWithCount[projectIndex].images, imageIndex);
    });
  });

  document.querySelectorAll('[data-open-catalogue]').forEach((button) => {
    button.addEventListener('click', (event) => {
      const index = Number(event.currentTarget.dataset.openCatalogue);
      openLightbox(allImages, index);
    });
  });

  document.querySelector('[data-lightbox-close]')?.addEventListener('click', closeLightbox);
  document.querySelector('[data-lightbox-next]')?.addEventListener('click', nextImage);
  document.querySelector('[data-lightbox-prev]')?.addEventListener('click', prevImage);

  const lightbox = document.querySelector('.lightbox');
  lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  lightbox?.addEventListener('touchstart', (event) => {
    state.touchStartX = event.changedTouches[0].screenX;
  });

  lightbox?.addEventListener('touchend', (event) => {
    state.touchEndX = event.changedTouches[0].screenX;
    const delta = state.touchEndX - state.touchStartX;
    if (Math.abs(delta) < 40) return;
    if (delta < 0) nextImage();
    if (delta > 0) prevImage();
  });
};

window.addEventListener('hashchange', () => {
  state.route = normalizeRoute();
  state.mobileMenuOpen = false;
  render();
});

window.addEventListener('keydown', (event) => {
  if (!state.lightboxOpen) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowRight') nextImage();
  if (event.key === 'ArrowLeft') prevImage();
});

state.route = normalizeRoute();
if (!window.location.hash) {
  window.location.hash = '#selected';
}
render();
