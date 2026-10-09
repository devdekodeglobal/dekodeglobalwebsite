import React, { useEffect, useMemo, useState } from 'react';
import { Sun, Moon, LogOut, ArrowUp } from 'lucide-react';
import '../../styles/kb.css';

export default function DocLayout({ title, lead, role = 'Internal', sections = [], theme, onToggleTheme, onBack, onLogout, children }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(sections[0]?.id || '');
  const filtered = useMemo(() => sections.filter((s) => s.label.toLowerCase().includes(query.toLowerCase())), [sections, query]);

  useEffect(() => {
    const onScroll = () => {
      let current = sections[0]?.id;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top < 140) current = s.id;
      }
      if (current) setActive(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [sections]);

  return (
    <div className="kb" data-theme={theme}>
      <header className="kb-topbar">
        <div className="kb-topbar-inner">
          <button onClick={onBack} className="kb-icon-btn" title="Back to Hub" style={{ width: 'auto', padding: '0 10px', fontSize: 13, fontWeight: 700 }}>← Hub</button>
          <a className="brand-logo" onClick={onBack} style={{ cursor: 'pointer' }}>DEKODE</a>
          <span className="kb-role-pill">{role}</span>
          <div className="kb-topbar-actions">
            <button className="kb-icon-btn" onClick={onToggleTheme} aria-label="Toggle theme">{theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}</button>
            <button className="kb-icon-btn" onClick={onLogout} aria-label="Logout"><LogOut size={15} /></button>
          </div>
        </div>
      </header>
      <div className="kb-layout">
        <aside className="kb-sidebar">
          <input className="kb-search" placeholder="Filter sections…" value={query} onChange={(e) => setQuery(e.target.value)} />
          <div className="kb-nav-group">Sections</div>
          {filtered.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={`kb-nav-link${active === s.id ? ' active' : ''}`} onClick={() => setActive(s.id)}>{s.label}</a>
          ))}
        </aside>
        <article className="kb-doc">
          <span className="status-badge">{role} Guide</span>
          <h1 style={{ marginTop: 10 }}>{title}</h1>
          {lead && <p className="kb-lead">{lead}</p>}
          {children}
        </article>
      </div>
      <button className="kb-icon-btn kb-back-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"><ArrowUp size={16} /></button>
    </div>
  );
}
