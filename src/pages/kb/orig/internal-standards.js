// Theme toggle logic (Light / Dark mode)
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const themeLabel = document.getElementById('theme-label');
    const htmlEl = document.documentElement;

    function applyTheme(theme) {
      htmlEl.setAttribute('data-theme', theme);
      try { localStorage.setItem('company_handbook_theme', theme); } catch (e) {}
      if (themeIcon) themeIcon.textContent = theme === 'light' ? 'Dark' : 'Light';
      if (themeLabel) themeLabel.textContent = theme === 'light' ? 'Dark Mode' : 'Light Mode';
      if (themeBtn) themeBtn.setAttribute('title', theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode');
    }

    var savedTheme = 'dark';
    try { savedTheme = localStorage.getItem('company_handbook_theme') || 'dark'; } catch (e) {}
    applyTheme(savedTheme);

    if (themeBtn) themeBtn.addEventListener('click', () => {
      const current = htmlEl.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });

    // Mobile Drawer Navigation
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');

    function toggleMobileNav() {
      const isOpen = sidebar.classList.contains('open');
      if (isOpen) {
        sidebar.classList.remove('open');
        backdrop.classList.remove('open');
      } else {
        sidebar.classList.add('open');
        backdrop.classList.add('open');
      }
    }

    if (mobileBtn) mobileBtn.addEventListener('click', toggleMobileNav);
    if (backdrop) backdrop.addEventListener('click', toggleMobileNav);

    // Close drawer when clicking a link on mobile
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
          sidebar.classList.remove('open');
          backdrop.classList.remove('open');
        }
      });
    });

    // Active link highlighting on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const backToTopBtn = document.getElementById('back-to-top');

    function updateNav() {
      const scrollPos = window.scrollY || document.documentElement.scrollTop;
      let current = '';

      sections.forEach(sec => {
        const top = sec.offsetTop - 100;
        const height = sec.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          current = sec.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });

      if (scrollPos > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Sidebar search filter
    function filterNav() {
      const query = document.getElementById('sidebar-filter').value.toLowerCase().trim();
      const links = document.querySelectorAll('.nav-links li');
      const groupTitles = document.querySelectorAll('.nav-group-title');

      links.forEach(li => {
        const match = li.textContent.toLowerCase().includes(query);
        li.style.display = match ? '' : 'none';
      });

      document.querySelectorAll('#nav-container').forEach(nav => {
        const groups = nav.querySelectorAll('.nav-links');
        groups.forEach((ul, idx) => {
          const hasVisible = Array.from(ul.querySelectorAll('li')).some(li => li.style.display !== 'none');
          if (groupTitles[idx]) {
            groupTitles[idx].style.display = hasVisible ? '' : 'none';
          }
        });
      });
    }

    // Interactive Pre-Build Gate Checklist
    function togglePrebuildCheck(element) {
      element.classList.toggle('active');
      const items = document.querySelectorAll('#prebuild-check-list .check-item');
      const activeCount = document.querySelectorAll('#prebuild-check-list .check-item.active').length;
      const scoreBadge = document.getElementById('gate-score-badge');
      if (!scoreBadge) return;

      if (activeCount === 6) {
        scoreBadge.className = 'badge badge-success';
        scoreBadge.textContent = '6 / 6 · Ready to Build';
      } else if (activeCount >= 3) {
        scoreBadge.className = 'badge badge-warning';
        scoreBadge.textContent = `${activeCount} / 6 · Draft Missing Docs`;
      } else {
        scoreBadge.className = 'badge badge-danger';
        scoreBadge.textContent = `${activeCount} / 6 · Stop Before Building`;
      }
    }

    window.addEventListener('scroll', updateNav, { passive: true });
    window.addEventListener('DOMContentLoaded', updateNav);
    updateNav();
;
function toggleMobileMenu(){var s=document.getElementById("sidebar");if(s)s.classList.toggle("open");}
;
(function(){var HUB="/team-kb-d7x9q2";var navved=false;document.querySelectorAll('.nav-links a[href^="#"]').forEach(function(a){a.addEventListener("click",function(){navved=true;if(window.innerWidth<=1024){var s=document.getElementById("sidebar"),b=document.getElementById("sidebar-backdrop");if(s)s.classList.remove("open");if(b)b.classList.remove("open");}});});window.addEventListener("hashchange",function(){if(!location.hash&&navved){try{window.top.location.href=HUB;}catch(e){window.location.href=HUB;}}});})();