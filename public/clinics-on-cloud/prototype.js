const views = [...document.querySelectorAll('[data-view]')];
const validRoutes = new Set(['home', 'catalogue', 'kiosk', 'organisations']);
const mascotDock = document.getElementById('mascot-dock');
const mascotButton = document.getElementById('mascot-button');
const chatPanel = document.getElementById('chat-panel');
const chatClose = document.getElementById('chat-close');
const productVideo = document.getElementById('product-video');
const productFilmSection = document.getElementById('product-film');
const videoFrame = document.querySelector('.product-video-frame');
const videoPlayButton = document.getElementById('video-play');
const videoMuteButton = document.getElementById('video-mute');
const videoFullscreenButton = document.getElementById('video-fullscreen');
const mobileNav = document.getElementById('mobile-nav');
const menuButton = document.getElementById('menu-button');

function navigate(route) {
  const next = validRoutes.has(route) ? route : 'home';
  views.forEach(view => view.classList.toggle('active', view.dataset.view === next));
  document.body.classList.toggle('home-view', next === 'home');
  document.querySelectorAll('[data-route]').forEach(control => control.classList.toggle('active', control.dataset.route === next));
  mobileNav.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
  if (location.hash !== `#${next}`) history.replaceState(null, '', `#${next}`);
  if (next !== 'home') {
    closeChat(false);
    productVideo.pause();
  }
  window.scrollTo({ top: 0, behavior: 'auto' });
}

document.querySelectorAll('[data-route]').forEach(control => {
  control.addEventListener('click', event => {
    event.preventDefault();
    navigate(control.dataset.route);
  });
});
window.addEventListener('hashchange', () => navigate(location.hash.slice(1)));
menuButton.addEventListener('click', () => {
  mobileNav.hidden = !mobileNav.hidden;
  menuButton.setAttribute('aria-expanded', String(!mobileNav.hidden));
  menuButton.setAttribute('aria-label', mobileNav.hidden ? 'Open menu' : 'Close menu');
});

function openChat() {
  mascotDock.classList.add('no-walk', 'arrived', 'chat-open');
  chatPanel.hidden = false;
  mascotButton.setAttribute('aria-expanded', 'true');
  document.getElementById('chat-name').focus();
}

function closeChat(returnFocus = true) {
  chatPanel.hidden = true;
  mascotDock.classList.remove('chat-open');
  mascotButton.setAttribute('aria-expanded', 'false');
  if (returnFocus) mascotButton.focus();
}

mascotDock.addEventListener('animationend', event => {
  if (event.target === mascotDock) mascotDock.classList.add('arrived');
});
if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
  mascotDock.classList.add('no-walk', 'arrived');
}
mascotButton.addEventListener('click', openChat);
chatClose.addEventListener('click', () => closeChat());
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !chatPanel.hidden) closeChat();
});

document.getElementById('watch-video').addEventListener('click', () => {
  productFilmSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  videoPlayButton.focus({ preventScroll: true });
});

function toggleVideoPlayback() {
  if (productVideo.paused) {
    productVideo.play().catch(() => {});
  } else {
    productVideo.pause();
  }
}

function updateVideoPlaybackControl() {
  const playing = !productVideo.paused && !productVideo.ended;
  videoPlayButton.setAttribute('aria-label', playing ? 'Pause video' : 'Play video');
  videoPlayButton.querySelector('.video-play-label').textContent = playing ? 'Pause' : 'Play';
  videoPlayButton.querySelector('.video-play-icon').hidden = playing;
  videoPlayButton.querySelector('.video-pause-icon').hidden = !playing;
}

function updateVideoMuteControl() {
  videoMuteButton.setAttribute('aria-label', productVideo.muted ? 'Unmute video' : 'Mute video');
  videoMuteButton.querySelector('.video-mute-label').textContent = productVideo.muted ? 'Unmute' : 'Mute';
  videoMuteButton.querySelector('.video-sound-on').hidden = productVideo.muted;
  videoMuteButton.querySelector('.video-sound-off').hidden = !productVideo.muted;
}

videoPlayButton.addEventListener('click', toggleVideoPlayback);
productVideo.addEventListener('click', toggleVideoPlayback);
productVideo.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    toggleVideoPlayback();
  }
});
['play', 'pause', 'ended'].forEach(eventName => productVideo.addEventListener(eventName, updateVideoPlaybackControl));
videoMuteButton.addEventListener('click', () => { productVideo.muted = !productVideo.muted; });
productVideo.addEventListener('volumechange', updateVideoMuteControl);
videoFullscreenButton.addEventListener('click', () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else if (videoFrame.requestFullscreen) {
    videoFrame.requestFullscreen();
  } else if (productVideo.webkitEnterFullscreen) {
    productVideo.webkitEnterFullscreen();
  }
});
document.addEventListener('fullscreenchange', () => {
  const fullscreen = document.fullscreenElement === videoFrame;
  videoFullscreenButton.setAttribute('aria-label', fullscreen ? 'Exit fullscreen' : 'Enter fullscreen');
  videoFullscreenButton.querySelector('.video-fullscreen-label').textContent = fullscreen ? 'Exit fullscreen' : 'Fullscreen';
});
updateVideoPlaybackControl();
updateVideoMuteControl();

const flyerDialog = document.getElementById('flyer-dialog');
document.getElementById('view-flyer').addEventListener('click', () => flyerDialog.showModal());
document.getElementById('close-flyer').addEventListener('click', () => flyerDialog.close());
flyerDialog.addEventListener('click', event => {
  if (event.target === flyerDialog) flyerDialog.close();
});

const catalogueBook = document.getElementById('catalogue-book');
const catalogueImage = document.getElementById('catalogue-page-image');
const catalogueTurnImage = document.getElementById('catalogue-turn-image');
const cataloguePrev = document.getElementById('catalogue-prev');
const catalogueNext = document.getElementById('catalogue-next');
const catalogueCount = document.getElementById('catalogue-page-count');
let cataloguePage = 1;
let catalogueTurning = false;
const catalogueSource = page => `catalogue/page-${String(page).padStart(2, '0')}.jpg`;

async function turnCataloguePage(direction) {
  const target = cataloguePage + direction;
  if (catalogueTurning || target < 1 || target > 12) return;
  catalogueTurning = true;
  const nextImage = new Image();
  nextImage.src = catalogueSource(target);
  try { await nextImage.decode(); } catch { catalogueTurning = false; return; }
  const currentSource = catalogueSource(cataloguePage);
  cataloguePage = target;
  catalogueImage.src = nextImage.src;
  catalogueImage.alt = `Catalogue page ${target} of 12`;
  catalogueCount.textContent = `Page ${target} of 12`;
  cataloguePrev.disabled = target === 1;
  catalogueNext.disabled = target === 12;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    catalogueTurning = false;
    return;
  }
  catalogueTurnImage.src = currentSource;
  catalogueBook.classList.add(direction > 0 ? 'turn-next' : 'turn-prev');
  requestAnimationFrame(() => requestAnimationFrame(() => catalogueBook.classList.add('is-turning')));
  setTimeout(() => {
    catalogueBook.classList.remove('is-turning', 'turn-next', 'turn-prev');
    catalogueTurning = false;
  }, 700);
  const following = target + direction;
  if (following >= 1 && following <= 12) new Image().src = catalogueSource(following);
}

cataloguePrev.addEventListener('click', () => turnCataloguePage(-1));
catalogueNext.addEventListener('click', () => turnCataloguePage(1));
let catalogueTouchStart = null;
catalogueBook.addEventListener('touchstart', event => { catalogueTouchStart = event.changedTouches[0].clientX; }, { passive: true });
catalogueBook.addEventListener('touchend', event => {
  if (catalogueTouchStart === null) return;
  const distance = event.changedTouches[0].clientX - catalogueTouchStart;
  if (Math.abs(distance) > 45) turnCataloguePage(distance < 0 ? 1 : -1);
  catalogueTouchStart = null;
}, { passive: true });
document.addEventListener('keydown', event => {
  if (location.hash !== '#catalogue') return;
  if (event.key === 'ArrowRight') turnCataloguePage(1);
  if (event.key === 'ArrowLeft') turnCataloguePage(-1);
});

document.getElementById('kiosk-form').addEventListener('submit', event => {
  event.preventDefault();
  const location = document.getElementById('kiosk-location').value.trim();
  if (!location) return;
  const message = `Hello DEKODE, I would like to find the nearest Clinics On Cloud kiosk. My city or PIN code is ${location}. Please share a confirmed location.`;
  window.open(`https://wa.me/918882848489?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
});

function wireWhatsAppEnquiry(formId, statusId) {
  const form = document.getElementById(formId);
  const status = document.getElementById(statusId);
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const lines = [
      'Hello DEKODE, I am interested in Clinics On Cloud.',
      `Name: ${data.get('name')}`,
      `Organisation: ${data.get('organisation')}`,
      `Contact number: ${data.get('phone')}`
    ];
    if (data.get('email')) lines.push(`Email: ${data.get('email')}`);
    if (data.get('setting')) lines.push(`Setting: ${data.get('setting')}`);
    if (data.get('message')) lines.push(`Question / details: ${data.get('message')}`);
    status.textContent = 'Review and send the prepared message in WhatsApp to share your details.';
    window.open(`https://wa.me/918882848489?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener,noreferrer');
  });
}

wireWhatsAppEnquiry('demo-form', 'demo-message');
wireWhatsAppEnquiry('chat-lead-form', 'chat-lead-message');
navigate(location.hash.slice(1));
