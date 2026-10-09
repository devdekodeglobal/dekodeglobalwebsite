// Theme Management
function initTheme() {
const savedTheme = localStorage.getItem('krafc-theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);
}

function toggleTheme() {
const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
document.documentElement.setAttribute('data-theme', newTheme);
localStorage.setItem('krafc-theme', newTheme);
updateThemeIcon(newTheme);
if (typeof initErdNetwork === 'function') {
initErdNetwork();
}
}

function updateThemeIcon(theme) {
const icon = document.getElementById('theme-icon');
if (icon) {
icon.textContent = theme === 'dark' ? 'Light' : 'Dark';
}
}

initTheme();

// Mobile Menu
function toggleMobileMenu() {
const sidebar = document.getElementById('sidebar');
sidebar.classList.toggle('open');
}

// Sidebar search filter
function filterNav() {
const query = document.getElementById('sidebar-filter').value.toLowerCase();
const links = document.querySelectorAll('.nav-links a');
links.forEach(link => {
const text = link.textContent.toLowerCase();
if (text.includes(query)) {
link.parentElement.style.display = 'block';
} else {
link.parentElement.style.display = 'none';
}
});
}

// Highlight active nav item on scroll
function updateActiveNav() {
const sections = document.querySelectorAll('section, .doc-hero');
const links = document.querySelectorAll('.nav-links a');
let currentSectionId = '';

sections.forEach(section => {
const rect = section.getBoundingClientRect();
if (rect.top <= 120 && rect.bottom >= 120) {
currentSectionId = section.getAttribute('id');
}
});

links.forEach(link => {
const href = link.getAttribute('href').replace('#', '');
if (href === currentSectionId) {
link.classList.add('active');
} else {
link.classList.remove('active');
}
});
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
window.addEventListener('DOMContentLoaded', updateActiveNav);

// Interactive Vis.js ERD Network
let erdNetwork = null;
let erdNodes = null;
let erdEdges = null;

function initErdNetwork() {
const container = document.getElementById('erd-container');
if (!container || typeof vis === 'undefined') return;

const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
const isLight = currentTheme === 'light';
const defaultNodeBg = isLight ? '#ffffff' : '#0d1527';
const defaultBorder = isLight ? '#94a3b8' : '#334155';
const defaultText = isLight ? '#000000' : '#ffffff';
const selectBorder = '#FFB611';

const nodesData = [
{ 
id: 'users', 
label: '1. USERS\n==========================\nid [PK], , , , ,  (TEXT 32)\nemail, , , , , ,  (TEXT)\nname, , , , , , , (TEXT)\npassword_hash, ,  (TEXT)\ngoogle_id, , , ,  (TEXT)\nemail_verified, , (INT)\ncreated_at, , , , (TIMESTAMP)', 
shape: 'box', 
x: -240, 
y: -140, 
font: { face: 'monospace', align: 'left', size: 13, color: defaultText, bold: { color: defaultText } }, 
color: { 
background: defaultNodeBg, 
border: '#0ea5e9',
highlight: { background: defaultNodeBg, border: selectBorder },
hover: { background: isLight ? '#f0f9ff' : '#1e293b', border: '#38bdf8' }
},
borderWidth: 2.5
},
{ 
id: 'sessions', 
label: '2. SESSIONS\n==========================\nid [PK], , , , ,  (TEXT 32)\nuser_id [FK], , , (TEXT 32)\nexpires_at, , , , (TIMESTAMP)\ncreated_at, , , , (TIMESTAMP)', 
shape: 'box', 
x: -240, 
y: 120, 
font: { face: 'monospace', align: 'left', size: 13, color: defaultText, bold: { color: defaultText } }, 
color: { 
background: defaultNodeBg, 
border: '#10b981',
highlight: { background: defaultNodeBg, border: selectBorder },
hover: { background: isLight ? '#ecfdf5' : '#1e293b', border: '#34d399' }
},
borderWidth: 2.5
},
{ 
id: 'projects', 
label: '3. PROJECTS\n==========================\nid [PK], , , , ,  (TEXT 32)\nuser_id [FK], , , (TEXT 32)\nname, , , , , , , (TEXT)\ndescription, , ,  (TEXT)\ncreated_at, , , , (TIMESTAMP)\nupdated_at, , , , (TIMESTAMP)', 
shape: 'box', 
x: 140, 
y: -140, 
font: { face: 'monospace', align: 'left', size: 13, color: defaultText, bold: { color: defaultText } }, 
color: { 
background: defaultNodeBg, 
border: '#8b5cf6',
highlight: { background: defaultNodeBg, border: selectBorder },
hover: { background: isLight ? '#f5f3ff' : '#1e293b', border: '#a78bfa' }
},
borderWidth: 2.5
},
{ 
id: 'designs', 
label: '4. DESIGNS (Spatial CAD)\n==========================\nid [PK], , , , ,  (TEXT 32)\nuser_id [FK], , , (TEXT 32)\nproject_id [FK],  (TEXT 32)\nname, , , , , , , (TEXT)\nconfig, , , , , , (JSON TEXT)\nelements, , , , , (JSON TEXT)\ncreated_at, , , , (TIMESTAMP)\nupdated_at, , , , (TIMESTAMP)', 
shape: 'box', 
x: 140, 
y: 120, 
font: { face: 'monospace', align: 'left', size: 13, color: defaultText, bold: { color: defaultText } }, 
color: { 
background: isLight ? '#fffbeb' : '#182235', 
border: '#f5a623',
highlight: { background: isLight ? '#fffbeb' : '#182235', border: selectBorder },
hover: { background: isLight ? '#fef3c7' : '#24324a', border: '#f5a623' }
},
borderWidth: 2.5
},
{ 
id: 'security_limits', 
label: '5. SECURITY LIMITS\n==========================\nid [PK], , , , ,  (TEXT)\nhits, , , , , , , (INT)\nreset_at, , , , , (INT)', 
shape: 'box', 
x: -460, 
y: 0, 
font: { face: 'monospace', align: 'left', size: 13, color: defaultText, bold: { color: defaultText } }, 
color: { 
background: defaultNodeBg, 
border: '#ef4444',
highlight: { background: defaultNodeBg, border: selectBorder },
hover: { background: isLight ? '#fef2f2' : '#1e293b', border: '#f87171' }
},
borderWidth: 2.5
},
{ 
id: 'registration_challenges', 
label: '6. REGISTRATION CHALLENGES\n==========================\nemail [PK], , , , (TEXT)\nuser_id, , , , ,  (TEXT)\npassword_hash, ,  (TEXT)\ncode_hash, , , ,  (TEXT)\nexpires_at, , , , (INT)', 
shape: 'box', 
x: 460, 
y: 0, 
font: { face: 'monospace', align: 'left', size: 13, color: defaultText, bold: { color: defaultText } }, 
color: { 
background: defaultNodeBg, 
border: '#f59e0b',
highlight: { background: defaultNodeBg, border: selectBorder },
hover: { background: isLight ? '#fffbeb' : '#1e293b', border: '#fbbf24' }
},
borderWidth: 2.5
}
];

const edgeFont = { 
size: 11, 
color: isLight ? '#0f172a' : '#f8fafc', 
strokeWidth: 3, 
strokeColor: isLight ? '#ffffff' : '#070d18' 
};

const edgesData = [
{ from: 'users', to: 'sessions', label: 'has active', arrows: 'to', font: edgeFont },
{ from: 'users', to: 'projects', label: 'owns', arrows: 'to', font: edgeFont },
{ from: 'users', to: 'designs', label: 'authors', arrows: 'to', font: edgeFont },
{ from: 'projects', to: 'designs', label: 'groups', arrows: 'to', font: edgeFont, color: { color: '#f5a623' } }
];

erdNodes = new vis.DataSet(nodesData);
erdEdges = new vis.DataSet(edgesData);

const options = {
nodes: { 
margin: 14, 
shadow: false,
chosen: {
label: function (values) {
values.color = defaultText;
values.mod = 'bold';
}
}
},
edges: { width: 2, color: { color: isLight ? '#94a3b8' : '#475569', highlight: '#f5a623' } },
interaction: { dragNodes: true, dragView: true, zoomView: true, hover: true },
physics: false
};

if (erdNetwork) erdNetwork.destroy();
erdNetwork = new vis.Network(container, { nodes: erdNodes, edges: erdEdges }, options);
}

window.addEventListener('DOMContentLoaded', initErdNetwork);

// Re-render ERD when theme changes (including iframe data-theme attribute updates)
const observer = new MutationObserver(function(mutations) {
mutations.forEach(function(mutation) {
if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
initErdNetwork();
}
});
});
observer.observe(document.documentElement, { attributes: true });
;
(function(){var HUB="/team-kb-d7x9q2";var navved=false;document.querySelectorAll('.nav-links a[href^="#"]').forEach(function(a){a.addEventListener("click",function(){navved=true;if(window.innerWidth<=1024){var s=document.getElementById("sidebar"),b=document.getElementById("sidebar-backdrop");if(s)s.classList.remove("open");if(b)b.classList.remove("open");}});});window.addEventListener("hashchange",function(){if(!location.hash&&navved){try{window.top.location.href=HUB;}catch(e){window.location.href=HUB;}}});})();