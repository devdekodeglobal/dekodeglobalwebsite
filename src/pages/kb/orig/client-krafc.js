function initTheme(){var s=localStorage.getItem('krafc-client-theme')||'dark';document.documentElement.setAttribute('data-theme',s);updateThemeIcon(s);}
function toggleMobileMenu(){var s=document.getElementById("sidebar");if(s)s.classList.toggle("open");}
function updateThemeIcon(t){var i=document.getElementById('theme-icon');if(i){i.textContent=t==='dark'?'Light':'Dark';}}
initTheme();
function toggleMobileMenu(){document.getElementById('sidebar').classList.toggle('open');}
function filterNav(){var q=document.getElementById('sidebar-filter').value.toLowerCase();document.querySelectorAll('.nav-links a').forEach(function(l){l.parentElement.style.display=l.textContent.toLowerCase().includes(q)?'block':'none';});}
function updateActiveNav(){var cur='';document.querySelectorAll('section').forEach(function(s){var r=s.getBoundingClientRect();if(r.top<=120&&r.bottom>=120){cur=s.id;}});document.querySelectorAll('.nav-links a').forEach(function(l){l.classList.toggle('active',l.getAttribute('href').replace('#','')===cur);});}
window.addEventListener('scroll',updateActiveNav,{passive:true});
window.addEventListener('DOMContentLoaded',updateActiveNav);
;
(function(){var HUB="/team-kb-d7x9q2";var navved=false;document.querySelectorAll('.nav-links a[href^="#"]').forEach(function(a){a.addEventListener("click",function(){navved=true;if(window.innerWidth<=1024){var s=document.getElementById("sidebar"),b=document.getElementById("sidebar-backdrop");if(s)s.classList.remove("open");if(b)b.classList.remove("open");}});});window.addEventListener("hashchange",function(){if(!location.hash&&navved){try{window.top.location.href=HUB;}catch(e){window.location.href=HUB;}}});})();