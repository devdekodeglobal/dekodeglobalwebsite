import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Layers, 
  Code2, 
  LogOut, 
  AlertCircle,
  Sun,
  Moon,
  PackageCheck,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

const INTERNAL_AUTH_KEY = 'dekode_internal_kb_auth';
const INTERNAL_ROLE_KEY = 'dekode_internal_kb_role';
const INTERNAL_THEME_KEY = 'dekode_internal_kb_theme';
const TEAM_PASSWORD = 'deko1234';
const CLIENT_PASSWORD = 'client1234';

const MODULES = [
  {
    id: 'standards',
    num: '01',
    title: 'Company Standards',
    tag: 'Core Standards',
    tier: 'internal',
    status: 'Ready',
    statusLabel: 'Ready',
    icon: Code2,
    accent: '#FFB611',
    accentBg: 'rgba(255, 182, 17, 0.12)',
    url: '/internal-docs/company-standards/index.html',
    desc: 'Engineering protocols, Git hygiene, security and testing benchmarks.'
  },
  {
    id: 'optiflow',
    num: '02',
    title: 'OptiFlow',
    tag: 'System & Architecture',
    tier: 'internal',
    status: 'Ready',
    statusLabel: 'Ready',
    icon: Layers,
    accent: '#22d3ee',
    accentBg: 'rgba(34, 211, 238, 0.12)',
    url: '/internal-docs/optiflow/index.html',
    desc: 'Distribution engine, FIFO allocation, diagrams and contributor guide.'
  },
  {
    id: 'krafc',
    num: '03',
    title: 'krafc',
    tag: '3D CAD & Spatial WebGL',
    tier: 'internal',
    status: 'Ready',
    statusLabel: 'Ready',
    icon: PackageCheck,
    accent: '#0ea5e9',
    accentBg: 'rgba(14, 165, 233, 0.12)',
    url: '/internal-docs/krafc/index.html',
    desc: 'Dual-engine Konva/BabylonJS architecture, spatial math and specs.'
  },
  {
    id: 'client-standards',
    num: 'C1',
    title: 'Company Standards',
    tag: 'Client Hub',
    tier: 'external',
    status: 'Ready',
    statusLabel: 'Ready',
    icon: Code2,
    accent: '#FFB611',
    accentBg: 'rgba(255, 182, 17, 0.12)',
    url: '/client-docs/company-standards/index.html',
    desc: 'How we work, what we deliver, FAQs and contact details.'
  },
  {
    id: 'client-optiflow',
    num: 'C2',
    title: 'OptiFlow Overview',
    tag: 'Client Hub',
    tier: 'external',
    status: 'Ready',
    statusLabel: 'Ready',
    icon: Layers,
    accent: '#22d3ee',
    accentBg: 'rgba(34, 211, 238, 0.12)',
    url: '/client-docs/optiflow/index.html',
    desc: 'Product tour, live prototype, FAQs and onboarding info.'
  },
  {
    id: 'client-krafc',
    num: 'C3',
    title: 'krafc Overview',
    tag: 'Client Hub',
    tier: 'external',
    status: 'Ready',
    statusLabel: 'Ready',
    icon: PackageCheck,
    accent: '#0ea5e9',
    accentBg: 'rgba(14, 165, 233, 0.12)',
    url: '/client-docs/krafc/index.html',
    desc: 'Product tour, live platform preview, FAQs and project flow.'
  }
];

export default function InternalKnowledgeBase({ _secretPath = '/internal-kb-d7x9q2' }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem(INTERNAL_AUTH_KEY) === 'authenticated';
  });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(INTERNAL_THEME_KEY) || 'dark';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [role, setRole] = useState(() => {
    return sessionStorage.getItem(INTERNAL_ROLE_KEY) || 'internal';
  });

  const isLight = theme === 'light';

  const toggleTheme = () => {
    const nextTheme = isLight ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem(INTERNAL_THEME_KEY, nextTheme);
    localStorage.setItem('company_handbook_theme', nextTheme);
    localStorage.setItem('optiflow_guide_theme', nextTheme);
    localStorage.setItem('krafc_guide_theme', nextTheme);

    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentDocument) {
      try {
        iframe.contentDocument.documentElement.setAttribute('data-theme', nextTheme);
      } catch {
        // Cross-origin fallback
      }
    }
  };

  useEffect(() => {
    document.title = 'DEKODE - Knowledge Base';
    window.scrollTo(0, 0);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const input = passwordInput.trim().toLowerCase();
    let nextRole = null;
    if (input === TEAM_PASSWORD.toLowerCase()) {
      nextRole = 'internal';
    } else if (input === CLIENT_PASSWORD.toLowerCase()) {
      nextRole = 'external';
    } else {
      setErrorMsg('Incorrect password.');
      return;
    }
    setErrorMsg('');
    sessionStorage.setItem(INTERNAL_AUTH_KEY, 'authenticated');
    sessionStorage.setItem(INTERNAL_ROLE_KEY, nextRole);
    setRole(nextRole);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(INTERNAL_AUTH_KEY);
    sessionStorage.removeItem(INTERNAL_ROLE_KEY);
    setIsAuthenticated(false);
    setSelectedDoc(null);
  };

    // Clean, consistent gold-accented palette across both light and dark modes
  const t = {
    bg: isLight ? '#f8fafc' : '#080d1a',
    surface: isLight ? '#ffffff' : '#0e1526',
    border: isLight ? '#e2e8f0' : '#1e293b',
    borderHover: isLight ? '#cbd5e1' : '#334155',
    text: isLight ? '#0f172a' : '#f8fafc',
    textMuted: isLight ? '#475569' : '#94a3b8',
    textDim: isLight ? '#64748b' : '#64748b',
    gold: '#FFB611',
    goldBg: isLight ? 'rgba(255, 182, 17, 0.14)' : 'rgba(255, 182, 17, 0.12)',
    goldSolidText: isLight ? '#000000' : '#FFB611',
    inputBg: isLight ? '#ffffff' : '#040711',
    cardHover: isLight ? '#f1f5f9' : '#131c33'
  };

  // 1. Password Lock Gate
  if (!isAuthenticated) {
    return (
      <div style={{
        width: '100%',
        minHeight: '100vh',
        background: isLight
          ? 'linear-gradient(180deg, #f8faff 0%, #e2e8f0 100%)'
          : 'radial-gradient(circle at 50% 30%, rgba(255, 182, 17, 0.06), transparent 60%), #080d1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        boxSizing: 'border-box',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        color: t.text,
        position: 'relative'
      }}>
        {/* Minimal Theme Switcher */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: isLight ? '#ffffff' : 'none',
            border: `1px solid ${isLight ? '#cbd5e1' : t.border}`,
            color: t.text,
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
          }}
        >
          {isLight ? <Moon size={16} color="#0f172a" /> : <Sun size={16} color={t.gold} />}
        </button>

        <div style={{
          width: '100%',
          maxWidth: '380px',
          borderRadius: '20px',
          border: isLight ? '1px solid #cbd5e1' : `1px solid ${t.border}`,
          padding: '36px 28px',
          textAlign: 'center',
          boxShadow: isLight
            ? '0 10px 30px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(0,0,0,0.04)'
            : '0 20px 50px rgba(0,0,0,0.5), 0 0 60px rgba(255, 182, 17, 0.06)',
          position: 'relative'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '18px',
            background: isLight
              ? '#FFB611'
              : `radial-gradient(circle at 50% 35%, rgba(255, 182, 17, 0.25), ${t.goldBg})`,
            border: isLight ? 'none' : '1px solid rgba(255, 182, 17, 0.35)',
            boxShadow: isLight ? '0 4px 14px rgba(255, 182, 17, 0.35)' : '0 0 32px rgba(255, 182, 17, 0.20)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            color: isLight ? '#000000' : t.gold
          }}>
            <ShieldCheck size={28} strokeWidth={2.5} />
          </div>

          <div style={{
            fontSize: '11px',
            letterSpacing: '0.12em',
            color: isLight ? '#b45309' : t.gold,
            fontWeight: 800,
            textTransform: 'uppercase',
            marginBottom: '6px'
          }}>
            DEKODE INTERNAL
          </div>

          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '22px', fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em', color: t.text }}>
            Team Knowledge Base
          </h1>

          <p style={{ fontSize: '13px', color: t.textMuted, margin: '0 0 24px', lineHeight: '1.4' }}>
            Enter your team or client passkey to access documentation.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: t.textDim }} />
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Team or client password"
                autoFocus
                onFocus={(e) => { e.target.style.borderColor = t.gold; e.target.style.boxShadow = '0 0 0 3px rgba(255, 182, 17, 0.25)'; }}
                onBlur={(e) => { e.target.style.borderColor = errorMsg ? '#ef4444' : (isLight ? '#cbd5e1' : t.border); e.target.style.boxShadow = 'none'; }}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 38px',
                  backgroundColor: isLight ? '#f8fafc' : t.inputBg,
                  border: errorMsg ? '1px solid #ef4444' : (isLight ? '1px solid #cbd5e1' : `1px solid ${t.border}`),
                  borderRadius: '10px',
                  color: t.text,
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
                }}
              />
            </div>

            {errorMsg && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontSize: '12px', textAlign: 'left' }}>
                <AlertCircle size={14} />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 182, 17, 0.4)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, #ffd34d 0%, #FFB611 50%, #e69a00 100%)',
                border: 'none',
                borderRadius: '10px',
                color: '#080d1a',
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease'
              }}
            >
              Enter Knowledge Base
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. Focused Full-Screen Document Reader (Mobile responsive top bar)
  if (selectedDoc) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: t.bg,
        color: t.text,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
      }}>
        {/* Minimal Reader Bar */}
        <header style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          backgroundColor: t.surface,
          borderBottom: `1px solid ${t.border}`,
          flexShrink: 0,
          gap: '10px'
        }}>
          <button
            onClick={() => setSelectedDoc(null)}
            style={{
              background: 'none',
              border: `1px solid ${t.border}`,
              color: t.text,
              padding: '6px 10px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flexShrink: 0
            }}
          >
            <ArrowLeft size={15} />
            <span style={{ display: 'inline' }}>Back</span>
          </button>

          <div style={{
            fontSize: '13px',
            fontWeight: 700,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
            textAlign: 'center'
          }}>
            {selectedDoc.title}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              style={{
                background: 'none',
                border: `1px solid ${t.border}`,
                color: t.text,
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              {isLight ? <Moon size={14} /> : <Sun size={14} color={t.gold} />}
            </button>
          </div>
        </header>

        {/* Iframe Viewport */}
        <div style={{ flex: 1, width: '100%', position: 'relative', backgroundColor: t.bg }}>
          <iframe
            src={selectedDoc.url}
            title={selectedDoc.title}
            onLoad={(e) => {
              try {
                e.target.contentDocument.documentElement.setAttribute('data-theme', theme);
              } catch {
                // Ignore cross-origin fallback
              }
            }}
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      </div>
    );
  }

  // 3. Clean & Minimalist Knowledge Base Hub (Mobile First, No Fluff)
  // View is driven by login role: team password shows internal docs,
  // client password shows client-safe docs. No manual switching.
  const visibleModules = MODULES.filter((m) => (m.tier || 'internal') === role);
  const isClient = role === 'external';
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: t.bg,
      color: t.text,
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      boxSizing: 'border-box'
    }}>
      {/* Sleek Header */}
      <header style={{
        backgroundColor: t.surface,
        borderBottom: `1px solid ${t.border}`,
        position: 'sticky',
        top: 0,
        zIndex: 20
      }}>
        <div style={{
          maxWidth: '680px',
          margin: '0 auto',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '15px', fontWeight: 900, letterSpacing: '-0.02em', color: t.text }}>
              DEKODE
            </span>
            <span style={{
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: t.goldBg,
              color: t.gold,
              fontWeight: 700
            }}>
              KB
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              style={{
                background: 'none',
                border: `1px solid ${t.border}`,
                color: t.text,
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              {isLight ? <Moon size={14} /> : <Sun size={14} color={t.gold} />}
            </button>

            <button
              onClick={handleLogout}
              title="Lock & Logout"
              style={{
                background: 'none',
                border: `1px solid ${t.border}`,
                color: t.textDim,
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Clean Main Container */}
      <main style={{
        maxWidth: '680px',
        margin: '0 auto',
        padding: '28px 18px 48px'
      }}>
        {/* Minimal Hero Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{
            fontSize: '22px',
            fontWeight: 800,
            margin: '0 0 6px',
            letterSpacing: '-0.02em',
            color: t.text
          }}>
            {isClient ? 'Client Knowledge Base' : 'Engineering Knowledge Base'}
          </h1>
          <p style={{
            fontSize: '13px',
            color: t.textMuted,
            margin: 0,
            lineHeight: '1.4'
          }}>
            {isClient ? 'Product guides, manuals and release notes.' : 'Internal technical specifications, guidelines, and product guides.'}
          </p>
        </div>

        {/* Role badge with doc count (view is set by login, no manual switching) */}
        <div style={{ marginBottom: '18px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            padding: '5px 12px',
            borderRadius: '999px',
            backgroundColor: isLight ? '#FFB611' : t.goldBg,
            border: `1px solid #FFB611`,
            boxShadow: isLight ? '0 2px 8px rgba(255, 182, 17, 0.35)' : 'none',
            color: isLight ? '#000000' : t.gold
          }}>
            {isClient ? 'Client-Facing Docs' : 'Internal Engineering'} · {visibleModules.length}
          </span>
        </div>

        {/* Glassmorphic Module Row Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {visibleModules.map((item) => {
            const Icon = item.icon;
            const isReady = item.status === 'Ready';
            const accent = item.accent || t.gold;
            const accentBg = item.accentBg || t.goldBg;

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (isReady && item.url) {
                    setSelectedDoc(item);
                  }
                }}
                style={{
                  background: isLight ? t.surface : `linear-gradient(135deg, ${t.surface} 0%, #111a2e 100%)`,
                  borderRadius: '16px',
                  border: `1px solid ${t.border}`,
                  padding: '16px 16px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  cursor: isReady ? 'pointer' : 'default',
                  opacity: isReady ? 1 : 0.65,
                  transition: 'border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease',
                  userSelect: 'none'
                }}
                onMouseEnter={(e) => {
                  if (isReady) {
                    e.currentTarget.style.borderColor = accent;
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = `0 8px 24px ${accentBg}`;
                    const arrow = e.currentTarget.querySelector('[data-arrow]');
                    if (arrow) { arrow.style.color = accent; arrow.style.filter = `drop-shadow(0 0 6px ${accent})`; arrow.style.transform = 'translateX(3px)'; }
                  }
                }}
                onMouseLeave={(e) => {
                  if (isReady) {
                    e.currentTarget.style.borderColor = t.border;
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                    const arrow = e.currentTarget.querySelector('[data-arrow]');
                    if (arrow) { arrow.style.color = t.textDim; arrow.style.filter = 'none'; arrow.style.transform = 'none'; }
                  }
                }}
              >
                {/* Squircle icon badge with accent gradient tint */}
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  background: `linear-gradient(135deg, ${accentBg}, transparent)`,
                  border: `1px solid ${accent}33`,
                  color: isReady ? accent : t.textDim,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={20} />
                </div>

                {/* Two-tier info: title + pill / value line */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' }}>
                    <h2 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: t.text }}>
                      {item.title}
                    </h2>
                    {!isReady && (
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        backgroundColor: isLight ? '#f1f5f9' : '#1e293b',
                        border: `1px solid ${t.border}`,
                        color: t.textDim,
                        whiteSpace: 'nowrap'
                      }}>
                        Upcoming
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '12.5px', color: t.textMuted, margin: 0, lineHeight: '1.45' }}>
                    {item.desc}
                  </p>
                </div>

                {/* Subtle arrow action */}
                {isReady && (
                  <span data-arrow style={{
                    color: t.textDim,
                    display: 'flex',
                    alignItems: 'center',
                    flexShrink: 0,
                    transition: 'color 0.15s ease, transform 0.15s ease, filter 0.15s ease'
                  }}>
                    <ChevronRight size={20} />
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Minimal Footer */}
        <div style={{
          marginTop: '36px',
          textAlign: 'center',
          fontSize: '11px',
          color: t.textDim
        }}>
          {isClient ? 'DEKODE · Client Reference' : 'DEKODE Engineering · Internal Team Reference'}
        </div>
      </main>
    </div>
  );
}
