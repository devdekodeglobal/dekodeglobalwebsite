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
const videoBackButton = document.getElementById('video-back');
const videoForwardButton = document.getElementById('video-forward');
const videoSeek = document.getElementById('video-seek');
const videoTime = document.getElementById('video-time');
// Remove casual browser save affordances without changing playback controls.
videoFrame.addEventListener('contextmenu', event => event.preventDefault());
const mobileNav = document.getElementById('mobile-nav');
const menuButton = document.getElementById('menu-button');

function navigate(route) {
  const requested = route === 'locations' ? 'kiosk' : route;
  const next = validRoutes.has(requested) ? requested : 'home';
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
  videoFrame.classList.toggle('has-started', playing || productVideo.currentTime > 0);
}

function formatVideoTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  const whole = Math.floor(seconds);
  const minutes = Math.floor(whole / 60);
  const hours = Math.floor(minutes / 60);
  return hours ? `${hours}:${String(minutes % 60).padStart(2, '0')}:${String(whole % 60).padStart(2, '0')}` : `${minutes}:${String(whole % 60).padStart(2, '0')}`;
}

function updateVideoTimeline() {
  const duration = Number.isFinite(productVideo.duration) ? productVideo.duration : 0;
  const current = Math.min(productVideo.currentTime || 0, duration || Infinity);
  videoSeek.max = String(duration);
  videoSeek.value = String(current);
  videoSeek.disabled = !duration;
  videoBackButton.disabled = !duration;
  videoForwardButton.disabled = !duration;
  videoSeek.style.setProperty('--seek-progress', `${duration ? current / duration * 100 : 0}%`);
  videoTime.textContent = `${formatVideoTime(current)} / ${formatVideoTime(duration)}`;
  videoFrame.classList.toggle('has-started', current > 0 || !productVideo.paused);
}

function skipVideo(seconds) {
  if (!Number.isFinite(productVideo.duration)) return;
  productVideo.currentTime = Math.max(0, Math.min(productVideo.duration, productVideo.currentTime + seconds));
  updateVideoTimeline();
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
['loadedmetadata', 'durationchange', 'timeupdate', 'seeked'].forEach(eventName => productVideo.addEventListener(eventName, updateVideoTimeline));
videoSeek.addEventListener('input', () => {
  productVideo.currentTime = Number(videoSeek.value);
  updateVideoTimeline();
});
videoBackButton.addEventListener('click', () => skipVideo(-10));
videoForwardButton.addEventListener('click', () => skipVideo(5));
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
updateVideoTimeline();

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
const catalogueFullsize = document.getElementById('catalogue-fullsize');
const catalogueDialog = document.getElementById('catalogue-dialog');
const catalogueDialogImage = document.getElementById('catalogue-dialog-image');
const catalogueDialogCount = document.getElementById('catalogue-dialog-count');
const catalogueDialogPrev = document.getElementById('catalogue-dialog-prev');
const catalogueDialogNext = document.getElementById('catalogue-dialog-next');
const catalogueZoom = document.getElementById('catalogue-zoom');
let cataloguePage = 1;
let catalogueTurning = false;
const catalogueSource = page => `catalogue/page-${String(page).padStart(2, '0')}.jpg`;

function setCatalogueZoom(zoomed) {
  catalogueDialog.classList.toggle('is-zoomed', zoomed);
  catalogueZoom.setAttribute('aria-pressed', String(zoomed));
  catalogueZoom.textContent = zoomed ? 'Fit page' : 'Zoom to read';
}

function openCatalogueDialog() {
  catalogueDialogImage.src = catalogueSource(cataloguePage);
  catalogueDialogImage.alt = `Catalogue page ${cataloguePage} of 12`;
  setCatalogueZoom(matchMedia('(min-width: 701px)').matches);
  catalogueDialog.showModal();
}

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
  catalogueDialogImage.src = catalogueSource(target);
  catalogueDialogImage.alt = `Catalogue page ${target} of 12`;
  catalogueDialogCount.textContent = `Page ${target} of 12`;
  cataloguePrev.disabled = target === 1;
  catalogueNext.disabled = target === 12;
  catalogueDialogPrev.disabled = target === 1;
  catalogueDialogNext.disabled = target === 12;
  document.getElementById('catalogue-dialog-stage').scrollTo(0, 0);
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
catalogueDialogPrev.addEventListener('click', () => turnCataloguePage(-1));
catalogueDialogNext.addEventListener('click', () => turnCataloguePage(1));
catalogueFullsize.addEventListener('click', openCatalogueDialog);
catalogueBook.addEventListener('click', openCatalogueDialog);
catalogueBook.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openCatalogueDialog(); }
});
catalogueZoom.addEventListener('click', () => setCatalogueZoom(!catalogueDialog.classList.contains('is-zoomed')));
document.getElementById('catalogue-close').addEventListener('click', () => catalogueDialog.close());
catalogueDialog.addEventListener('click', event => { if (event.target === catalogueDialog) catalogueDialog.close(); });
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

const sampleAreas = [
  { name: 'Andheri example area', area: 'Andheri East, Mumbai', lat: 19.1156, lon: 72.8703 },
  { name: 'Powai example area', area: 'Powai, Mumbai', lat: 19.1197, lon: 72.9054 },
  { name: 'BKC example area', area: 'Bandra Kurla Complex, Mumbai', lat: 19.0596, lon: 72.8656 }
];
const kioskSearch = document.getElementById('kiosk-location');
const locationResults = document.getElementById('location-results');
const locationEmpty = document.getElementById('location-empty');
const locationDetail = document.getElementById('location-detail');
let selectedArea = sampleAreas[0];

function selectArea(area) {
  selectedArea = area;
  document.getElementById('location-detail-title').textContent = area.name;
  document.getElementById('location-detail-copy').textContent = `${area.area}. This map pin marks the general area, not an operating kiosk address.`;
  const west = (area.lon - .015).toFixed(5);
  const south = (area.lat - .009).toFixed(5);
  const east = (area.lon + .015).toFixed(5);
  const north = (area.lat + .009).toFixed(5);
  const mapFrame = document.getElementById('location-map-frame');
  mapFrame.src = `https://www.openstreetmap.org/export/embed.html?bbox=${west}%2C${south}%2C${east}%2C${north}&layer=mapnik&marker=${area.lat}%2C${area.lon}`;
  mapFrame.title = `Illustrative area map near ${area.area}`;
  document.getElementById('location-open-map').href = `https://www.openstreetmap.org/?mlat=${area.lat}&mlon=${area.lon}#map=15/${area.lat}/${area.lon}`;
  locationResults.querySelectorAll('.location-result').forEach(button => {
    button.classList.toggle('selected', button.dataset.area === area.name);
    button.setAttribute('aria-pressed', String(button.dataset.area === area.name));
  });
}

function renderAreas(query = '') {
  const normalized = query.toLocaleLowerCase();
  const matches = sampleAreas.filter(area => `${area.name} ${area.area}`.toLocaleLowerCase().includes(normalized));
  locationResults.replaceChildren();
  for (const area of matches) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'location-result';
    button.dataset.area = area.name;
    const name = document.createElement('strong');
    name.textContent = area.name;
    const address = document.createElement('small');
    address.textContent = `${area.area} · Illustrative area`;
    const tag = document.createElement('span');
    tag.className = 'location-demo-tag';
    tag.textContent = 'Demo location';
    button.append(name, address, tag);
    button.addEventListener('click', () => selectArea(area));
    locationResults.append(button);
  }
  const hasMatches = matches.length > 0;
  locationEmpty.hidden = hasMatches;
  locationDetail.hidden = !hasMatches;
  document.getElementById('location-map-empty').hidden = hasMatches;
  document.getElementById('kiosk-map-search').href = `https://www.openstreetmap.org/search?query=${encodeURIComponent(query)}`;
  if (hasMatches) selectArea(matches.includes(selectedArea) ? selectedArea : matches[0]);
}

document.getElementById('kiosk-form').addEventListener('submit', event => {
  event.preventDefault();
  renderAreas(kioskSearch.value.trim());
});
function askForKiosk(area) {
  const message = `Hello DEKODE, I would like to find a verified Clinics On Cloud kiosk near ${area}. Please share a confirmed address and visiting hours.`;
  window.open(`https://wa.me/918882848489?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
}
document.getElementById('kiosk-ask-selected').addEventListener('click', () => askForKiosk(selectedArea.area));
document.getElementById('kiosk-ask-empty').addEventListener('click', () => askForKiosk(kioskSearch.value.trim() || 'my area'));
renderAreas();

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
