import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  ExternalLink, 
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
const INTERNAL_THEME_KEY = 'dekode_internal_kb_theme';
const VALID_PASSWORD = 'deko1234';

const MODULES = [
  {
    id: 'standards',
    num: '01',
    title: 'Company Engineering Standards',
    tag: 'Core Standards',
    status: 'Ready',
    icon: Code2,
    url: '/internal-docs/company-standards/index.html',
    desc: 'Engineering protocols, Git hygiene, security & testing benchmarks.'
  },
  {
    id: 'optiflow',
    num: '02',
    title: 'OptiFlow',
    tag: 'System & Architecture',
    status: 'Ready',
    icon: Layers,
    url: '/internal-docs/optiflow/index.html',
    desc: 'Distribution engine, FIFO allocation, diagrams & contributor guide.'
  },
  {
    id: 'krafc',
    num: '03',
    title: 'krafc',
    tag: '3D CAD & Spatial WebGL',
    status: 'Ready',
    icon: PackageCheck,
    url: '/internal-docs/krafc/index.html',
    desc: 'Dual-engine Konva/BabylonJS architecture, spatial math & technical specs.'
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
    document.title = 'DEKODE — Team Knowledge Base';
    window.scrollTo(0, 0);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput.trim() === VALID_PASSWORD) {
      sessionStorage.setItem(INTERNAL_AUTH_KEY, 'authenticated');
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Incorrect team password.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(INTERNAL_AUTH_KEY);
    setIsAuthenticated(false);
    setSelectedDoc(null);
  };

  // Clean, high-legibility minimalist palette
  const t = {
    bg: isLight ? '#f8fafc' : '#080d1a',
    surface: isLight ? '#ffffff' : '#0e1526',
    border: isLight ? '#e2e8f0' : '#1e293b',
    borderHover: isLight ? '#cbd5e1' : '#334155',
    text: isLight ? '#0f172a' : '#f8fafc',
    textMuted: isLight ? '#475569' : '#94a3b8',
    textDim: isLight ? '#64748b' : '#64748b',
    gold: '#f5a623',
    goldBg: isLight ? '#fffbeb' : 'rgba(245, 166, 35, 0.08)',
    inputBg: isLight ? '#ffffff' : '#040711',
    cardHover: isLight ? '#f1f5f9' : '#131c33'
  };

  // 1. Password Lock Gate
  if (!isAuthenticated) {
    return (
      <div style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: t.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        boxSizing: 'border-box',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        color: t.text,
        position: 'relative'
      }}>
        {/* Minimal Theme Switcher */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: `1px solid ${t.border}`,
            color: t.text,
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          {isLight ? <Moon size={16} /> : <Sun size={16} color={t.gold} />}
        </button>

        <div style={{
          width: '100%',
          maxWidth: '380px',
          backgroundColor: t.surface,
          borderRadius: '16px',
          border: `1px solid ${t.border}`,
          padding: '32px 24px',
          textAlign: 'center',
          boxShadow: isLight ? '0 10px 30px rgba(0,0,0,0.04)' : '0 20px 50px rgba(0,0,0,0.5)'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: t.goldBg,
            border: `1px solid rgba(245, 166, 35, 0.25)`,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            color: t.gold
          }}>
            <ShieldCheck size={24} />
          </div>

          <div style={{ fontSize: '11px', letterSpacing: '0.1em', color: t.gold, fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
            DEKODE Internal
          </div>

          <h1 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
            Team Knowledge Base
          </h1>

          <p style={{ fontSize: '13px', color: t.textMuted, margin: '0 0 24px', lineHeight: '1.4' }}>
            Enter team passkey to access engineering documentation.
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
                placeholder="Team password"
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 38px',
                  backgroundColor: t.inputBg,
                  border: errorMsg ? '1px solid #ef4444' : `1px solid ${t.border}`,
                  borderRadius: '10px',
                  color: t.text,
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
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
              style={{
                width: '100%',
                padding: '12px',
                background: t.gold,
                border: 'none',
                borderRadius: '10px',
                color: '#080d1a',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Continue
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
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
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

            <a
              href={selectedDoc.url}
              target="_blank"
              rel="noopener noreferrer"
              title="Open full page"
              style={{
                background: t.goldBg,
                border: `1px solid rgba(245, 166, 35, 0.3)`,
                color: t.gold,
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none'
              }}
            >
              <ExternalLink size={14} />
            </a>
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
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: t.bg,
      color: t.text,
      fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
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
            Engineering Knowledge Base
          </h1>
          <p style={{
            fontSize: '13px',
            color: t.textMuted,
            margin: 0,
            lineHeight: '1.4'
          }}>
            Internal technical specifications, guidelines, and product guides.
          </p>
        </div>

        {/* Minimal Module Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {MODULES.map((item) => {
            const Icon = item.icon;
            const isReady = item.status === 'Ready';

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (isReady && item.url) {
                    setSelectedDoc(item);
                  }
                }}
                style={{
                  backgroundColor: t.surface,
                  borderRadius: '12px',
                  border: `1px solid ${t.border}`,
                  padding: '16px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: isReady ? 'pointer' : 'default',
                  opacity: isReady ? 1 : 0.65,
                  transition: 'border-color 0.15s ease, transform 0.1s ease',
                  userSelect: 'none'
                }}
                onMouseEnter={(e) => {
                  if (isReady) {
                    e.currentTarget.style.borderColor = t.gold;
                  }
                }}
                onMouseLeave={(e) => {
                  if (isReady) {
                    e.currentTarget.style.borderColor = t.border;
                  }
                }}
              >
                {/* Left: Number + Icon + Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0, marginRight: '12px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: isReady ? t.goldBg : (isLight ? '#f1f5f9' : '#1e293b'),
                    color: isReady ? t.gold : t.textDim,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={18} />
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <span style={{ fontSize: '11px', color: t.textDim, fontWeight: 700 }}>
                        {item.num}
                      </span>
                      <h2 style={{
                        fontSize: '15px',
                        fontWeight: 700,
                        margin: 0,
                        color: t.text,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {item.title}
                      </h2>
                    </div>
                    <p style={{
                      fontSize: '12px',
                      color: t.textMuted,
                      margin: 0,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Right: Status Pill or Arrow */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  {isReady ? (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: t.gold
                    }}>
                      Open <ChevronRight size={15} />
                    </span>
                  ) : (
                    <span style={{
                      fontSize: '11px',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      backgroundColor: isLight ? '#f1f5f9' : '#1e293b',
                      color: t.textDim,
                      fontWeight: 600
                    }}>
                      Upcoming
                    </span>
                  )}
                </div>
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
          DEKODE Engineering · Internal Team Reference
        </div>
      </main>
    </div>
  );
}
