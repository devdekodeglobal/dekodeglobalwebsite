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
      const a = e.target.closest && e.target.closest('a.brand-logo');
      if (a && onNavigateHome) {
        e.preventDefault();
        onNavigateHome();
      }
    };
    const root = ref.current;
    if (root) root.addEventListener('click', onHomeClick);

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

  return (
    <div ref={ref} className={`kb-orig kb-orig-${docId}`} data-theme="light"
      style={{ background: '#f4f7fd' }}
      dangerouslySetInnerHTML={{ __html: bodyHtml }} />
  );
}
