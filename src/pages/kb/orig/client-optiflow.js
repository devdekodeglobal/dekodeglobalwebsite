const themeBtn=document.getElementById('theme-toggle');const themeIcon=document.getElementById('theme-icon');const htmlEl=document.documentElement;
function applyTheme(t){htmlEl.setAttribute('data-theme',t);try{localStorage.setItem('optiflow-client-theme',t);}catch(e){}if(themeIcon)themeIcon.textContent=t==='light'?String.fromCharCode(0xD83C,0xDF19):String.fromCharCode(0x2600,0xFE0F);if(themeBtn)themeBtn.setAttribute('title',t==='light'?'Switch to Dark Mode':'Switch to Light Mode');}
let saved='dark';try{saved=localStorage.getItem('optiflow-client-theme')||'dark';}catch(e){}applyTheme(saved);
if(themeBtn)themeBtn.addEventListener('click',()=>{applyTheme(htmlEl.getAttribute('data-theme')==='light'?'dark':'light');});
function filterNav(){const q=document.getElementById('sidebar-filter').value.toLowerCase();document.querySelectorAll('#nav-container a').forEach(a=>{a.parentElement.style.display=a.textContent.toLowerCase().includes(q)?'':'none';});}
const btt=document.getElementById('back-to-top');window.addEventListener('scroll',()=>{btt.style.display=window.scrollY>600?'flex':'none';});btt.style.display='none';
;
function toggleMobileMenu(){var s=document.getElementById("sidebar");if(s)s.classList.toggle("open");}
;
(function(){var HUB="/team-kb-d7x9q2";var navved=false;document.querySelectorAll('.nav-links a[href^="#"]').forEach(function(a){a.addEventListener("click",function(){navved=true;if(window.innerWidth<=1024){var s=document.getElementById("sidebar"),b=document.getElementById("sidebar-backdrop");if(s)s.classList.remove("open");if(b)b.classList.remove("open");}});});window.addEventListener("hashchange",function(){if(!location.hash&&navved){try{window.top.location.href=HUB;}catch(e){window.location.href=HUB;}}});})();