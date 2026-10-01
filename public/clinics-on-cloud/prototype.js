const views = [...document.querySelectorAll('[data-view]')];
const validRoutes = new Set(['home', 'organisations']);
const mascotDock = document.getElementById('mascot-dock');
const mascotButton = document.getElementById('mascot-button');
const chatPanel = document.getElementById('chat-panel');
const chatClose = document.getElementById('chat-close');
const videoDialog = document.getElementById('video-dialog');
const productVideo = document.getElementById('product-video');

function navigate(route) {
  const next = validRoutes.has(route) ? route : 'home';
  views.forEach(view => view.classList.toggle('active', view.dataset.view === next));
  document.body.classList.toggle('home-view', next === 'home');
  if (location.hash !== `#${next}`) history.replaceState(null, '', `#${next}`);
  if (next !== 'home') closeChat(false);
  window.scrollTo({ top: 0, behavior: 'auto' });
}

document.querySelectorAll('[data-route]').forEach(control => {
  control.addEventListener('click', event => {
    event.preventDefault();
    navigate(control.dataset.route);
  });
});
window.addEventListener('hashchange', () => navigate(location.hash.slice(1)));

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
  videoDialog.showModal();
  productVideo.play().catch(() => {});
});
document.getElementById('video-close').addEventListener('click', () => videoDialog.close());
videoDialog.addEventListener('click', event => {
  if (event.target === videoDialog) videoDialog.close();
});
videoDialog.addEventListener('close', () => productVideo.pause());

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
