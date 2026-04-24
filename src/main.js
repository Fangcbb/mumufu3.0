import './styles.css';
import { allImages, projectsWithCount } from './data/mock-projects.js';

const app = document.querySelector('#app');

const state = {
  route: 'selected',
  lightboxOpen: false,
  lightboxImages: [],
  lightboxIndex: 0,
  touchStartX: 0,
  touchEndX: 0
};

const normalizeRoute = () => {
  const hash = window.location.hash.replace('#', '').trim();
  if (['selected', 'catalogue', 'info'].includes(hash)) return hash;
  return 'selected';
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

const projectLayoutClass = (projectIndex, imageIndex) => {
  const presets = [
    ['a-lead', 'a-side-top', 'a-side-bottom', 'a-left-mid', 'a-center-wide'],
    ['b-left-tall', 'b-right-tall', 'b-cross-wide', 'b-float-left', 'b-float-right'],
    ['c-left-hero', 'c-index-1', 'c-index-2', 'c-index-3', 'c-right-end']
  ];

  const set = presets[projectIndex % presets.length];
  return set[imageIndex % set.length];
};

const selectedMarkup = () => {
  const sections = projectsWithCount
    .map((project, projectIndex) => {
      const imageCells = project.images
        .map(
          (image, imageIndex) => `<button class="editorial-item ${projectLayoutClass(projectIndex, imageIndex)}" data-open-project="${projectIndex}" data-open-index="${imageIndex}" aria-label="Open ${image.alt}">
            <img src="${image.src}" alt="${image.alt}" loading="lazy" />
          </button>`
        )
        .join('');

      return `<section class="project-block">
        <header class="project-header">
          <h2>${project.title}</h2>
          <p>[ ${project.count} ]</p>
        </header>
        <div class="project-layout layout-${(projectIndex % 3) + 1}">${imageCells}</div>
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
      <span>${image.projectTitle}</span>
    </button>`
    )
    .join('');

  return `<main class="page catalogue-page">
    <div class="catalogue-stream">${list}</div>
  </main>`;
};

const infoMarkup = () => `<main class="page info-page">
  <section>
    <p>YUN MU</p>
    <p>PHOTOGRAPHER / DIRECTOR</p>
    <p>NEW YORK</p>
  </section>
  <section>
    <p>CONTACT</p>
    <p><a href="mailto:hello@yunmustudio.com">HELLO@YUNMUSTUDIO.COM</a></p>
  </section>
  <section>
    <p>SELECTED CLIENTS</p>
    <p>MICROSOFT</p>
    <p>ARC'TERYX</p>
    <p>OAKLEY</p>
    <p>NIKE</p>
  </section>
  <section>
    <p>SOCIAL</p>
    <p><a href="#" aria-label="Instagram link placeholder">INSTAGRAM</a></p>
  </section>
</main>`;

const lightboxMarkup = () => {
  if (!state.lightboxOpen) return '';
  const current = state.lightboxImages[state.lightboxIndex];
  const currentCount = `${state.lightboxIndex + 1}/${state.lightboxImages.length}`;

  return `<div class="lightbox" role="dialog" aria-modal="true">
    <button class="lightbox-close" data-lightbox-close aria-label="Close">[ x ] Close</button>
    <p class="lightbox-count">${currentCount}</p>
    <p class="lightbox-sound">Sound [ off ]</p>
    <button class="lightbox-hit prev" data-lightbox-prev aria-label="Previous image"></button>
    <figure class="lightbox-frame">
      <img src="${current.src}" alt="${current.alt}" />
    </figure>
    <button class="lightbox-hit next" data-lightbox-next aria-label="Next image"></button>
  </div>`;
};

const pageMarkup = () => {
  if (state.route === 'catalogue') return catalogueMarkup();
  if (state.route === 'info') return infoMarkup();
  return selectedMarkup();
};

const render = () => {
  app.innerHTML = `
    <div class="site-shell">
      <header class="topbar">
        <span class="menu-label">Menu</span>
        <nav class="nav" aria-label="Primary">
          <a href="#selected" class="${state.route === 'selected' ? 'active' : ''}">Selected</a>
          <a href="#catalogue" class="${state.route === 'catalogue' ? 'active' : ''}">Catalogue</a>
          <a href="#info" class="${state.route === 'info' ? 'active' : ''}">Info</a>
        </nav>
      </header>
      ${pageMarkup()}
      ${lightboxMarkup()}
    </div>
  `;

  bindEvents();
};

const bindEvents = () => {
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
    if (event.target === lightbox) closeLightbox();
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
  render();
});

window.addEventListener('keydown', (event) => {
  if (!state.lightboxOpen) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowRight') nextImage();
  if (event.key === 'ArrowLeft') prevImage();
});

state.route = normalizeRoute();
if (!window.location.hash) window.location.hash = '#selected';
render();
