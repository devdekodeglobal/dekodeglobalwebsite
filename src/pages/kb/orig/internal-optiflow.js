// Theme toggle logic (Light / Dark mode)
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const htmlEl = document.documentElement;

    // Shared script variables
    var erdNetwork = null;
    var erdNodes = null;
    var erdEdges = null;

    function applyTheme(theme) {
      htmlEl.setAttribute('data-theme', theme);
      try { localStorage.setItem('optiflow_guide_theme', theme); } catch (e) {}
      if (themeIcon) themeIcon.textContent = theme === 'light' ? 'Dark' : 'Light';
      if (themeBtn) themeBtn.setAttribute('title', theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode');
      if (typeof initErdNetwork === 'function' && document.getElementById('vis-network-container')) {
        initErdNetwork();
      }
    }

    var savedTheme = 'dark';
    try { savedTheme = localStorage.getItem('optiflow_guide_theme') || 'dark'; } catch (e) {}
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

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
          sidebar.classList.remove('open');
          backdrop.classList.remove('open');
        }
      });
    });

    // Architecture Diagrams Tab Switching
    function openArchTab(evt, tabName) {
      document.querySelectorAll('#infrastructure-topology .tab-content').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('#infrastructure-topology .tab-btn').forEach(b => b.classList.remove('active'));
      const target = document.getElementById(tabName);
      if (target) {
        target.classList.add('active');
        evt.currentTarget.classList.add('active');
      }
    }

    // Proposed Process Automated Decision Workflow Path Highlighting
    function highlightAutoPath(evt, pathClass) {
      document.querySelectorAll('#proposed-process .filter-btn').forEach(btn => btn.classList.remove('active'));
      if (evt && evt.currentTarget) {
        evt.currentTarget.classList.add('active');
      }

      const elements = document.querySelectorAll('.auto-flow-element');
      elements.forEach(el => {
        if (pathClass === 'all') {
          el.classList.remove('dimmed');
        } else {
          if (el.classList.contains(pathClass)) {
            el.classList.remove('dimmed');
          } else {
            el.classList.add('dimmed');
          }
        }
      });
    }

    // Allocation Logic Flowchart Path Highlighting
    function highlightPath(pathClass) {
      document.querySelectorAll('#allocation-engine .filter-btn').forEach(btn => btn.classList.remove('active'));
      if (window.event && window.event.target) {
        window.event.target.classList.add('active');
      }

      const elements = document.querySelectorAll('.flow-element');
      elements.forEach(el => {
        if (pathClass === 'all') {
          el.classList.remove('dimmed');
        } else {
          if (el.classList.contains(pathClass)) {
            el.classList.remove('dimmed');
          } else {
            el.classList.add('dimmed');
          }
        }
      });
    }

    // Active link on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const backToTopBtn = document.getElementById('back-to-top');

    function updateActiveNav() {
      const scrollPos = window.scrollY || document.documentElement.scrollTop;
      let current = '';

      sections.forEach(sec => {
        const top = sec.offsetTop - 120;
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

    // Vis-Network Interactive Relational ERD
    var __erdRetries = 0;
    function initErdNetwork() {
      const container = document.getElementById('vis-network-container');
      if (!container) return;
      if (typeof vis === 'undefined') {
        // Library not loaded yet (slow/blocked CDN), retry, then show fallback message
        if (__erdRetries < 20) {
          __erdRetries++;
          setTimeout(initErdNetwork, 500);
        } else {
          container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;min-height:400px;color:var(--text-muted);font-size:0.95rem;text-align:center;padding:24px;">Interactive ERD could not load (network library unreachable).<br>Please check your connection and refresh, the full data dictionary tables below remain available.</div>';
        }
        return;
      }
      __erdRetries = 0;

      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const isLight = currentTheme === 'light';
      
      // Theme-adaptive crisp palettes
      const defaultNodeBg = isLight ? '#ffffff' : '#0f172a';
      const defaultText = isLight ? '#000000' : '#ffffff';
      const planogramBg = isLight ? '#fef3c7' : '#1e1b18';
      const salesBg = isLight ? '#e0f2fe' : '#0b1e36';
      const selectBorder = '#FFB611';

      const nodesData = [
        { 
          id: 'stores', 
          label: '1. STORES\n==========================\nstore_code [PK]  (VARCHAR)\nstore_name        (VARCHAR)\nstore_type        (VARCHAR)\nstore_grade       (VARCHAR)\ndispatch_slab     (VARCHAR)\nregion            (VARCHAR)\nzone              (VARCHAR)\nteam_rank         (INT)\ncsv_aliases       (JSONB)', 
          shape: 'box', 
          x: -380, 
          y: -100, 
          font: { face: 'monospace', align: 'left', size: 13, color: defaultText, bold: { color: defaultText } }, 
          color: { 
            background: defaultNodeBg, 
            border: '#2563eb', 
            highlight: { background: defaultNodeBg, border: selectBorder },
            hover: { background: isLight ? '#eff6ff' : '#1e293b', border: '#3b82f6' } 
          }, 
          borderWidth: 2.5 
        },
        { 
          id: 'brands', 
          label: '2. BRANDS\n==========================\nbrand_name [PK]  (VARCHAR)\nbrand_code       (VARCHAR)\nbrand_type       (VARCHAR)\nbrand_category   (VARCHAR)\nsupplier_name    (VARCHAR)', 
          shape: 'box', 
          x: 0, 
          y: -230, 
          font: { face: 'monospace', align: 'left', size: 13, color: defaultText, bold: { color: defaultText } }, 
          color: { 
            background: defaultNodeBg, 
            border: '#059669', 
            highlight: { background: defaultNodeBg, border: selectBorder },
            hover: { background: isLight ? '#ecfdf5' : '#1e293b', border: '#10b981' } 
          }, 
          borderWidth: 2.5 
        },
        { 
          id: 'products', 
          label: '3. PRODUCTS (Catalog)\n==========================\nitem_code [PK]   (VARCHAR)\nbrand_name [FK]  (VARCHAR)\nproduct_type     (VARCHAR)\nmrp              (NUMERIC)\nmodel_id         (VARCHAR)\ncolor            (VARCHAR)\ngender           (VARCHAR)\nsize             (VARCHAR)\nshape            (VARCHAR)\nframe_type       (VARCHAR)\nraw_description  (TEXT)\ncsv_aliases      (JSONB)', 
          shape: 'box', 
          x: 0, 
          y: 0, 
          font: { face: 'monospace', align: 'left', size: 13, color: defaultText, bold: { color: defaultText } }, 
          color: { 
            background: defaultNodeBg, 
            border: '#9333ea', 
            highlight: { background: defaultNodeBg, border: selectBorder },
            hover: { background: isLight ? '#f5f3ff' : '#1e293b', border: '#a855f7' } 
          }, 
          borderWidth: 2.5 
        },
        { 
          id: 'planograms', 
          label: '4. PLANOGRAMS\n==========================\nstore_code [PK][FK] (VARCHAR)\nbrand_name [PK][FK] (VARCHAR)\nproduct_type [PK]    (VARCHAR)\nfacing               (INT)\nstart_month          (VARCHAR)\ndepth                (INT)', 
          shape: 'box', 
          x: -180, 
          y: 160, 
          font: { face: 'monospace', align: 'left', size: 13, color: defaultText, bold: { color: defaultText } }, 
          color: { 
            background: planogramBg, 
            border: '#FFB611', 
            highlight: { background: planogramBg, border: selectBorder },
            hover: { background: isLight ? '#fef3c7' : '#292524', border: '#f59e0b' } 
          }, 
          borderWidth: 2.5 
        },
        { 
          id: 'stock', 
          label: '5. STOCK\n==========================\nstore_code [FK]  (VARCHAR)\nitem_code [FK]   (VARCHAR)\nbarcode          (VARCHAR)\nquantity         (INT)\nbatch_no         (VARCHAR)\ngrn_timestamp    (TIMESTAMP)', 
          shape: 'box', 
          x: -380, 
          y: 150, 
          font: { face: 'monospace', align: 'left', size: 13, color: defaultText, bold: { color: defaultText } }, 
          color: { 
            background: defaultNodeBg, 
            border: isLight ? '#64748b' : '#475569', 
            highlight: { background: defaultNodeBg, border: selectBorder },
            hover: { background: isLight ? '#f8fafc' : '#1e293b', border: '#38bdf8' } 
          }, 
          borderWidth: 2 
        },
        { 
          id: 'sales', 
          label: '6. SALES\n==========================\nstore_code [FK]  (VARCHAR)\nitem_code [FK]   (VARCHAR)\nbarcode          (VARCHAR)\nquantity         (INT)\nnet_amount       (NUMERIC)\norder_date       (DATE)\nstatus           (VARCHAR)', 
          shape: 'box', 
          x: 380, 
          y: -100, 
          font: { face: 'monospace', align: 'left', size: 13, color: defaultText, bold: { color: defaultText } }, 
          color: { 
            background: salesBg, 
            border: '#0284c7', 
            highlight: { background: salesBg, border: selectBorder },
            hover: { background: isLight ? '#e0f2fe' : '#0f315a', border: '#38bdf8' } 
          }, 
          borderWidth: 2.5 
        },
        { 
          id: 'allocations', 
          label: '7. DISPATCH ALLOCATIONS\n==========================\nrun_id [PK]      (UUID)\nstore_code [FK]  (VARCHAR)\nitem_code [FK]   (VARCHAR)\nmatch_tier       (VARCHAR)\ngenerated_at     (TIMESTAMP)', 
          shape: 'box', 
          x: 380, 
          y: 150, 
          font: { face: 'monospace', align: 'left', size: 13, color: defaultText, bold: { color: defaultText } }, 
          color: { 
            background: defaultNodeBg, 
            border: isLight ? '#64748b' : '#475569', 
            highlight: { background: defaultNodeBg, border: selectBorder },
            hover: { background: isLight ? '#f8fafc' : '#1e293b', border: '#34d399' } 
          }, 
          borderWidth: 2 
        },
        { 
          id: 'audit_logs', 
          label: '8. AUDIT LOGS (Delta Tracking)\n==========================\naudit_id [PK]    (UUID)\ntable_name       (VARCHAR)\nrecord_key       (VARCHAR)\naction_type      (VARCHAR)\nchanged_by       (VARCHAR)\nchanged_at       (TIMESTAMP)\nold_state        (JSONB)\nnew_state        (JSONB)', 
          shape: 'box', 
          x: 0, 
          y: 280, 
          font: { face: 'monospace', align: 'left', size: 13, color: defaultText, bold: { color: defaultText } }, 
          color: { 
            background: planogramBg, 
            border: '#FFB611', 
            highlight: { background: planogramBg, border: selectBorder },
            hover: { background: isLight ? '#fef3c7' : '#292524', border: '#f59e0b' } 
          }, 
          borderWidth: 2 
        }
      ];

      const edgeFont = { 
        size: 11, 
        color: isLight ? '#0f172a' : '#f8fafc', 
        strokeWidth: 3, 
        strokeColor: isLight ? '#ffffff' : '#080d1a' 
      };

      const edgesData = [
        { from: 'stores', to: 'planograms', label: 'defines targets for', arrows: 'to', font: edgeFont },
        { from: 'brands', to: 'planograms', label: 'is targeted by', arrows: 'to', font: edgeFont },
        { from: 'brands', to: 'products', label: 'groups', arrows: 'to', font: edgeFont },
        { from: 'products', to: 'stock', label: 'tracked as', arrows: 'to', font: edgeFont },
        { from: 'stores', to: 'stock', label: 'holds SOH in', arrows: 'to', font: edgeFont },
        { from: 'products', to: 'sales', label: 'sold as', arrows: 'to', font: edgeFont, color: { color: '#f59e0b' } },
        { from: 'stores', to: 'sales', label: 'sells at', arrows: 'to', font: edgeFont, color: { color: '#f59e0b' } },
        { from: 'products', to: 'allocations', label: 'dispatched as', arrows: 'to', font: edgeFont },
        { from: 'stores', to: 'allocations', label: 'receives', arrows: 'to', font: edgeFont }
      ];

      erdNodes = new vis.DataSet(nodesData);
      erdEdges = new vis.DataSet(edgesData);

      const options = {
        nodes: {
          margin: 12,
          shadow: false,
          // Keep box dark on select - only the label gets emphasis.
          chosen: {
            label: function (values, id, selected, hovering) {
              values.color = defaultText;
              values.mod = 'bold';
            }
          }
        },
        edges: { 
          width: 2, 
          color: { color: isLight ? '#94a3b8' : '#475569', highlight: '#f59e0b' }, 
          smooth: { type: 'cubicBezier', roundness: 0.5 } 
        },
        interaction: { dragNodes: true, dragView: true, zoomView: true, hover: true },
        physics: false
      };

      if (erdNetwork) {
        erdNetwork.destroy();
      }
      erdNetwork = new vis.Network(container, { nodes: erdNodes, edges: erdEdges }, options);
    }

    // Expand All / Collapse All details helper
    function toggleDetails(sectionSelector, openState) {
      const section = document.querySelector(sectionSelector);
      if (!section) return;
      const detailsList = section.querySelectorAll('details.collapsible-card');
      detailsList.forEach(detail => {
        detail.open = openState;
      });
    }

    window.addEventListener('DOMContentLoaded', () => {
      initErdNetwork();
    });
    window.addEventListener('load', () => {
      if (!erdNetwork) initErdNetwork();
    });

    // Re-render ERD when theme changes (including iframe data-theme attribute updates)
    const erdThemeObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          initErdNetwork();
        }
      });
    });
    erdThemeObserver.observe(document.documentElement, { attributes: true });

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    window.addEventListener('DOMContentLoaded', updateActiveNav);
    updateActiveNav();
;
function toggleMobileMenu(){var s=document.getElementById("sidebar");if(s)s.classList.toggle("open");}
;
(function(){var HUB="/team-kb-d7x9q2";var navved=false;document.querySelectorAll('.nav-links a[href^="#"]').forEach(function(a){a.addEventListener("click",function(){navved=true;if(window.innerWidth<=1024){var s=document.getElementById("sidebar"),b=document.getElementById("sidebar-backdrop");if(s)s.classList.remove("open");if(b)b.classList.remove("open");}});});window.addEventListener("hashchange",function(){if(!location.hash&&navved){try{window.top.location.href=HUB;}catch(e){window.location.href=HUB;}}});})();