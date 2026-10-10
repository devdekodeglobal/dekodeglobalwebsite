import { useEffect, useRef } from 'react';
import { DataSet, Network } from 'vis-network/standalone';

/**
 * Renders an original KB HTML guide at 100% design fidelity:
 * scoped original CSS + verbatim body markup + original inline scripts
 * (sidebar filter, scrollspy, tabs, path highlighters, vis-network ERD).
 * Only one OrigDoc is ever mounted at a time, so document-level queries
 * and globals from the original scripts are safe.
 */
export default function OrigDoc({ docId, cssUrl, bodyHtml, scriptJs, themeKeys = [], theme, onThemeChange, onNavigateHome }) {
  const ref = useRef(null);
  // Light mode only (per design requirement) — applied synchronously during
  // render so there is no dark-theme flash before effects run.
  theme = 'light';
  document.documentElement.setAttribute('data-theme', 'light');
  themeKeys.forEach((k) => {
    try { if (localStorage.getItem(k) !== 'light') localStorage.setItem(k, 'light'); } catch {}
  });

  // Keep hub theme + legacy keys in sync (no-op visually, light-only)
  useEffect(() => {
    if (ref.current) ref.current.setAttribute('data-theme', 'light');
  }, [docId]);

  // Run original scripts once per doc; observe theme changes made by the
  // page's own toggle button and report back to the hub. Intercept the
  // brand-logo home links so back navigation stays in-app (history works,
  // mobile/browser back returns to the previous page).
  useEffect(() => {
    window.vis = window.vis || { DataSet, Network };
    const scriptEl = document.createElement('script');
    scriptEl.setAttribute('data-kb-orig', docId);
    // Wrap in IIFE: classic scripts share the global lexical env, so bare
    // `const`/`let` at the top of each doc script would throw
    // "Identifier has already been declared" when navigating between docs.
    // Re-export the handlers referenced by inline onclick attributes.
    scriptEl.textContent = `;(function(){
${scriptJs}
;['toggleMobileMenu','openArchTab','highlightPath','highlightAutoPath','toggleDetails','togglePrebuildCheck'].forEach(function(__k){ try { var __f = eval(__k); if (typeof __f !== 'undefined') window[__k] = __f; } catch (e) {} });
})();`;
    document.body.appendChild(scriptEl);

    const onHomeClick = (e) => {
      const a = e.target.closest && e.target.closest('a.brand-logo, a.kb-hub-back');
      if (a && onNavigateHome) {
        e.preventDefault();
        onNavigateHome();
      }
    };
    const root = ref.current;
    if (root) root.addEventListener('click', onHomeClick);

    // Inject a "Back" button: in the mobile topbar it sits on the right next
    // to Menu; in the desktop sidebar it sits next to the DEKODE logo.
    // Done via JS so every static body.html guide gets it without edits.
    try {
      const mkHub = (inTopbar) => {
        const a = document.createElement('a');
        a.href = '/team-kb-d7x9q2';
        a.target = '_top';
        a.title = 'Back to documents hub';
        a.textContent = 'Back';
        a.className = 'kb-hub-back kb-hub-back-inline' + (inTopbar ? ' mobile-menu-btn' : '');
        if (inTopbar) {
          a.style.cssText = 'text-decoration:none;';
        } else {
          a.style.cssText = 'font-size:13px;font-weight:700;text-decoration:none;border:1px solid rgba(255,255,255,.35);border-radius:8px;padding:4px 10px;color:#fff;white-space:nowrap;margin-left:8px;';
        }
        if (onNavigateHome) a.addEventListener('click', (e) => { e.preventDefault(); onNavigateHome(); });
        return a;
      };
      if (root && !root.querySelector('.kb-hub-back-inline')) {
        // Mobile topbar: right side, before the Menu button
        const topbar = root.querySelector('.mobile-topbar');
        const menuBtn = topbar && topbar.querySelector('.mobile-menu-btn');
        if (menuBtn) menuBtn.before(mkHub(true));
        // Desktop sidebar: next to the DEKODE logo
        const sideLogo = root.querySelector('.sidebar .brand-logo, .sidebar-header .brand-logo');
        if (sideLogo && !(sideLogo.nextElementSibling && sideLogo.nextElementSibling.classList &&
            sideLogo.nextElementSibling.classList.contains('kb-hub-back-inline'))) {
          sideLogo.after(mkHub(false));
        }
      }
    } catch {}

    const observer = new MutationObserver(() => {
      const next = document.documentElement.getAttribute('data-theme');
      if ((next === 'dark' || next === 'light') && next !== ref.current?.getAttribute('data-theme')) {
        if (ref.current) ref.current.setAttribute('data-theme', next);
        onThemeChange && onThemeChange(next);
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    window.scrollTo(0, 0);

    return () => {
      observer.disconnect();
      scriptEl.remove();
      if (root) root.removeEventListener('click', onHomeClick);
    };
  }, [docId]); // eslint-disable-line react-hooks/exhaustive-deps

  const goHome = (e) => {
    if (onNavigateHome) {
      e.preventDefault();
      onNavigateHome();
    }
    // else: let the plain href="/team-kb-d7x9q2" navigate
  };

  return (
    <div style={{ position: 'relative' }}>
      <a
        href="/team-kb-d7x9q2"
        target="_top"
        onClick={goHome}
        title="Back to documents hub"
        className="kb-hub-back"
      >
        Back
      </a>
      <div ref={ref} className={`kb-orig kb-orig-${docId}`} data-theme="light"
        style={{ background: '#f4f7fd' }}
        dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </div>
  );
}
