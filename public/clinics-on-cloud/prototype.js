const routeNames = new Set(['home', 'locations', 'report', 'organisations']);
const views = [...document.querySelectorAll('[data-view]')];
const menuButton = document.getElementById('menu-button');
const mobileNav = document.getElementById('mobile-nav');
const toast = document.getElementById('toast');
let toastTimer;

const steps = [
  { label: 'STEP 01 · START', detail: 'No technical knowledge needed. Choose a check on the screen and follow the prompts.' },
  { label: 'STEP 02 · CHECK', detail: 'The devices guide you through the selected measurements. A staff member can support the visit.' },
  { label: 'STEP 03 · REPORT', detail: 'Your results are organised into a clear report you can keep, review, or discuss with a professional.' },
  { label: 'STEP 04 · CARE', detail: 'When available, a doctor can help explain the results and suggest your next step.' }
];

const categories = {
  everyday: {
    symbol: '♡', kicker: 'EVERYDAY HEALTH', title: 'Know the basics about your body.',
    description: 'Quick checks that help you understand your day-to-day health.',
    tests: ['Blood pressure', 'Heart rate', 'SpO₂', 'BMI & weight', 'Body temperature']
  },
  heart: {
    symbol: '⌁', kicker: 'HEART & BLOOD', title: 'A closer look at key indicators.',
    description: 'Screening options can include cardiac and blood-related measurements.',
    tests: ['ECG', 'Blood sugar', 'Haemoglobin', 'Lipid profile', 'HbA1c']
  },
  specialist: {
    symbol: '✳', kicker: 'SPECIALISED CHECKS', title: 'More options when you need them.',
    description: 'Some kiosk models can support a broader range of health screening.',
    tests: ['Eye test', 'Ear test', 'Spirometry', 'Dermatology', 'Maternal health']
  }
};

// Illustrative records keep the finder interactive without implying verified live availability.
const demoLocations = [
  { id: 'andheri', name: 'Andheri example site', area: 'Andheri East, Mumbai', search: 'andheri mumbai 400069', tests: ['Everyday health', 'Heart & blood', 'Video consultation'], address: 'Illustrative location · Andheri East, Mumbai', hours: 'Hours to be confirmed' },
  { id: 'powai', name: 'Powai example site', area: 'Powai, Mumbai', search: 'powai mumbai 400076', tests: ['Everyday health', 'Selected blood checks'], address: 'Illustrative location · Powai, Mumbai', hours: 'Hours to be confirmed' },
  { id: 'bkc', name: 'BKC example site', area: 'Bandra Kurla Complex, Mumbai', search: 'bkc bandra kurla complex mumbai 400051', tests: ['Everyday health', 'Corporate screening'], address: 'Illustrative location · BKC, Mumbai', hours: 'Hours to be confirmed' }
];

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

function closeMenu() {
  mobileNav.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
}

function navigate(route, scroll = true) {
  const name = routeNames.has(route) ? route : 'home';
  views.forEach(view => view.classList.toggle('active', view.dataset.view === name));
  document.querySelectorAll('[data-route]').forEach(link => {
    if (link.matches('a')) link.setAttribute('aria-current', link.dataset.route === name ? 'page' : 'false');
  });
  if (location.hash !== `#${name}`) history.replaceState(null, '', `#${name}`);
  closeMenu();
  if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollHomeTo(id) {
  navigate('home', false);
  requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
}

document.querySelectorAll('[data-route]').forEach(control => control.addEventListener('click', event => {
  event.preventDefault();
  navigate(control.dataset.route);
}));
document.querySelectorAll('[data-scroll]').forEach(control => control.addEventListener('click', event => {
  event.preventDefault();
  scrollHomeTo(control.dataset.scroll);
}));
menuButton.addEventListener('click', () => {
  mobileNav.hidden = !mobileNav.hidden;
  menuButton.setAttribute('aria-expanded', String(!mobileNav.hidden));
});
window.addEventListener('hashchange', () => {
  const hash = location.hash.slice(1);
  if (hash === 'how-it-works') scrollHomeTo('how-it-works');
  else navigate(hash);
});

document.querySelectorAll('[data-step]').forEach(tab => tab.addEventListener('click', () => {
  const index = Number(tab.dataset.step);
  document.querySelectorAll('[data-step]').forEach(item => {
    const active = item === tab;
    item.classList.toggle('active', active);
    item.setAttribute('aria-selected', String(active));
    item.querySelector('.step-plus').textContent = active ? '−' : '+';
  });
  const panel = document.getElementById('step-panel');
  panel.setAttribute('aria-labelledby', tab.id);
  panel.innerHTML = `<span class="step-detail-label">${steps[index].label}</span><p>${steps[index].detail}</p>`;
}));

document.querySelectorAll('[data-category]').forEach(tab => tab.addEventListener('click', () => {
  const item = categories[tab.dataset.category];
  document.querySelectorAll('[data-category]').forEach(button => {
    button.classList.toggle('active', button === tab);
    button.setAttribute('aria-selected', String(button === tab));
  });
  document.getElementById('capability-display').innerHTML = `
    <div class="display-symbol" aria-hidden="true">${item.symbol}</div>
    <div class="display-kicker">${item.kicker}</div>
    <h3>${item.title}</h3><p>${item.description}</p>
    <div class="test-chips">${item.tests.map(test => `<span>${test}</span>`).join('')}</div>
    <button type="button" class="inline-link" data-find-kiosk>Find a kiosk to get started <span aria-hidden="true">↗</span></button>`;
  document.querySelector('[data-find-kiosk]').addEventListener('click', () => navigate('locations'));
}));

const locationResults = document.getElementById('location-results');
const locationDetail = document.getElementById('location-detail');
let selectedLocation = null;

function renderLocationDetail(location) {
  selectedLocation = location.id;
  locationDetail.innerHTML = `
    <div class="location-map" aria-hidden="true"><span class="map-road road-one"></span><span class="map-road road-two"></span><span class="map-road road-three"></span><span class="map-pin">+</span><span class="map-neighbourhood">${location.area.toUpperCase()}</span></div>
    <div class="location-detail-body"><span class="detail-kicker">DEMO LOCATION</span><h2>${location.name}</h2><p>${location.address}<br>${location.hours}</p><div class="detail-tags">${location.tests.map(test => `<span>${test}</span>`).join('')}</div><div class="detail-actions"><button type="button" id="directions-button">See area on map ↗</button><button type="button" id="availability-button">Ask about availability</button></div></div>`;
  document.getElementById('directions-button').addEventListener('click', () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.area)}`, '_blank', 'noopener,noreferrer');
  });
  document.getElementById('availability-button').addEventListener('click', () => {
    showToast('Live availability will appear when verified locations are connected.');
  });
  locationResults.querySelectorAll('[data-location]').forEach(card => card.classList.toggle('selected', card.dataset.location === location.id));
}

function renderLocations(query = '') {
  const normalized = query.trim().toLowerCase();
  const matches = demoLocations.filter(location => `${location.name} ${location.search}`.toLowerCase().includes(normalized));
  if (!matches.length) {
    locationResults.innerHTML = '<div class="location-empty">No example location matches that search. Try “Mumbai”, “Powai”, or “Andheri”.</div>';
    locationDetail.innerHTML = '<div class="location-map" aria-hidden="true"><span class="map-road road-one"></span><span class="map-road road-two"></span><span class="map-road road-three"></span><span class="map-neighbourhood">LOCATION PREVIEW</span></div><div class="location-detail-body"><span class="detail-kicker">NO MATCH</span><h2>Try another area.</h2><p>Search an example Mumbai neighbourhood to preview how location details would appear.</p></div>';
    selectedLocation = null;
    return;
  }
  locationResults.innerHTML = matches.map(location => `
    <button type="button" class="location-result ${selectedLocation === location.id ? 'selected' : ''}" data-location="${location.id}">
      <span class="location-result-head"><strong>${location.name}</strong><span aria-hidden="true">↗</span></span>
      <small>${location.area} · Illustrative site</small>
      <span class="location-result-tags">${location.tests.slice(0, 2).map(test => `<em>${test}</em>`).join('')}</span>
    </button>`).join('');
  locationResults.querySelectorAll('[data-location]').forEach(card => card.addEventListener('click', () => {
    const location = demoLocations.find(item => item.id === card.dataset.location);
    renderLocationDetail(location);
  }));
  if (!selectedLocation || !matches.some(item => item.id === selectedLocation)) renderLocationDetail(matches[0]);
}

document.getElementById('location-search-button').addEventListener('click', () => renderLocations(document.getElementById('location-search').value));
document.getElementById('location-search').addEventListener('input', event => renderLocations(event.target.value));
renderLocations();

document.getElementById('report-form').addEventListener('submit', event => {
  event.preventDefault();
  document.getElementById('report-message').textContent = 'Live report access is not connected in this prototype. Explore the sample report below.';
  document.getElementById('sample-report').hidden = false;
  document.getElementById('sample-report').scrollIntoView({ behavior: 'smooth' });
});
document.getElementById('open-sample-report').addEventListener('click', () => {
  document.getElementById('sample-report').hidden = false;
  document.getElementById('sample-report').scrollIntoView({ behavior: 'smooth' });
});
document.getElementById('print-sample').addEventListener('click', () => window.print());
document.getElementById('share-sample').addEventListener('click', async () => {
  const sampleLink = `${location.href.split('#')[0]}#report`;
  try {
    await navigator.clipboard.writeText(sampleLink);
    document.getElementById('sample-message').textContent = 'Link to this sample report experience copied.';
  } catch {
    document.getElementById('sample-message').textContent = 'You can copy this page URL to share the sample experience.';
  }
});
document.getElementById('consult-sample').addEventListener('click', () => {
  document.getElementById('sample-message').textContent = 'A doctor consultation request would start here once the service is connected.';
});
document.getElementById('demo-form').addEventListener('submit', event => {
  event.preventDefault();
  document.getElementById('demo-message').textContent = 'Enquiry prepared. This prototype does not send or store your details.';
});

const initialHash = location.hash.slice(1);
if (initialHash === 'how-it-works') scrollHomeTo('how-it-works');
else navigate(initialHash, false);

const mascotDock = document.getElementById('mascot-dock');
const mascotButton = document.getElementById('mascot-button');
const chatPanel = document.getElementById('chat-panel');
const chatClose = document.getElementById('chat-close');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

if ((initialHash && initialHash !== 'home') || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  mascotDock.classList.add('no-walk', 'arrived');
}
mascotDock.addEventListener('animationend', event => {
  if (event.target === mascotDock) mascotDock.classList.add('arrived');
});

function openChat() {
  mascotDock.classList.add('no-walk', 'arrived', 'chat-open');
  chatPanel.hidden = false;
  mascotButton.setAttribute('aria-expanded', 'true');
  chatInput.focus();
}

function closeChat() {
  chatPanel.hidden = true;
  mascotDock.classList.remove('chat-open');
  mascotButton.setAttribute('aria-expanded', 'false');
  mascotButton.focus();
}

mascotButton.addEventListener('click', openChat);
chatClose.addEventListener('click', closeChat);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !chatPanel.hidden) closeChat();
});

function addChatMessage(text, sender, action) {
  const row = document.createElement('div');
  row.className = `chat-message ${sender}`;
  const content = document.createElement('div');
  const bubble = document.createElement('span');
  bubble.className = 'chat-bubble';
  bubble.textContent = text;
  content.appendChild(bubble);
  if (action) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'chat-reply-action';
    button.textContent = `${action.label} ↗`;
    button.addEventListener('click', () => {
      navigate(action.route);
      closeChat();
    });
    content.appendChild(button);
  }
  row.appendChild(content);
  chatMessages.appendChild(row);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function answerQuestion(question) {
  const q = question.toLowerCase();
  if (/\b(hi|hello|hey|namaste)\b/.test(q)) {
    return { text: 'Hi! 👋 Ask me how the kiosk works, which checks it supports, how reports work, or where to find one.' };
  }
  if (/\b(report|result|download|pdf|print|receipt)\b/.test(q)) {
    return { text: 'After testing, the kiosk can provide a printed report and, where the service is available, a digital copy. A real report should open only after secure verification. You can explore a sample report here.', action: { label: 'Explore reports', route: 'report' } };
  }
  if (/\b(near|nearest|location|where|kiosk|clinic|address|pincode|pin code|kahan|kahaan)\b/.test(q) && !/\b(what|kya|do|work)\b/.test(q)) {
    return { text: 'The location finder is designed to show nearby kiosks and their available checks. The current map uses illustrative places; verified live locations will appear once connected.', action: { label: 'Open location finder', route: 'locations' } };
  }
  if (/\b(price|cost|fee|charge|rupee|pay|kitna|pricing)\b/.test(q)) {
    return { text: 'Test and deployment prices can vary by location, kiosk model and selected services. This prototype does not show a confirmed price. For deployment pricing, send the DEKODE team an enquiry.', action: { label: 'Ask about deployment', route: 'organisations' } };
  }
  if (/\b(test|check|blood|pressure|ecg|sugar|oxygen|spo2|bmi|available)\b/.test(q)) {
    return { text: 'Depending on the model, checks can include blood pressure, heart rate, oxygen level, BMI, blood sugar, ECG and more. The exact menu varies by kiosk and location.', action: { label: 'Explore health checks', route: 'home' } };
  }
  if (/\b(doctor|consult|video|prescription|medical advice)\b/.test(q)) {
    return { text: 'A doctor video consultation can be part of the connected care experience where available. The kiosk screening report offers measurements; a clinician should interpret real results and advise on care.' };
  }
  if (/\b(time|minutes|long|fast|quick|duration|kitni der)\b/.test(q)) {
    return { text: 'The product material describes a guided screening with results in under 10 minutes for supported checks. Actual time can vary by the tests selected and the location.' };
  }
  if (/\b(buy|install|organisation|organization|business|workplace|pharmacy|camp|deploy|model|demo)\b/.test(q)) {
    return { text: 'Clinics On Cloud can be considered for clinics, workplaces, pharmacies, residential communities and health camps. DEKODE can discuss the right model, test menu, setup and support for your setting.', action: { label: 'For organisations', route: 'organisations' } };
  }
  if (/\b(what|how|machine|works|work|kya|kaise|about)\b/.test(q)) {
    return { text: 'Clinics On Cloud is a self-contained health screening kiosk. You start on its touchscreen, complete selected checks using connected devices, receive a report, and may connect with a doctor where that service is available.' };
  }
  return { text: 'I can help with the machine, available checks, reports, nearby kiosks, doctor consultations or deployment. Try asking about one of these. For a specific medical result, please speak with a qualified clinician.' };
}

function submitChat(question) {
  const message = question.trim();
  if (!message) return;
  addChatMessage(message, 'user');
  chatInput.value = '';
  const answer = answerQuestion(message);
  window.setTimeout(() => addChatMessage(answer.text, 'bot', answer.action), 300);
}

chatForm.addEventListener('submit', event => {
  event.preventDefault();
  submitChat(chatInput.value);
});
document.querySelectorAll('[data-chat-prompt]').forEach(button => {
  button.addEventListener('click', () => submitChat(button.dataset.chatPrompt));
});
