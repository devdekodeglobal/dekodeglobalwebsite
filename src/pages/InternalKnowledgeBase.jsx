import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Layers, 
  Code2, 
  LogOut, 
  AlertCircle,
  PackageCheck,
  ChevronRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

import InternalCompanyStandards from './kb/internal/InternalCompanyStandards';
import InternalOptiFlowGuide from './kb/internal/InternalOptiFlowGuide';
import InternalKrafcGuide from './kb/internal/InternalKrafcGuide';
import InternalInduction from './kb/internal/InternalInduction';
import InternalKopal from './kb/internal/InternalKopal';
import ClientCompanyStandards from './kb/client/ClientCompanyStandards';
import ClientOptiFlowGuide from './kb/client/ClientOptiFlowGuide';
import ClientKrafcGuide from './kb/client/ClientKrafcGuide';
import ClientKopal from './kb/client/ClientKopal';
import '../styles/kb.css';
import krafcLogo from '../assets/krafc-logo.png';
import optiFlowLogo from '../assets/optiflow-logo.svg';
import kopalLogo from '../assets/kopal-logo.png';

const DOC_COMPONENTS = {
  induction: InternalInduction,
  standards: InternalCompanyStandards,
  optiflow: InternalOptiFlowGuide,
  krafc: InternalKrafcGuide,
  kopal: InternalKopal,
  'client-standards': ClientCompanyStandards,
  'client-optiflow': ClientOptiFlowGuide,
  'client-krafc': ClientKrafcGuide,
  'client-kopal': ClientKopal,
};
const INTERNAL_AUTH_KEY = 'dekode_internal_kb_auth';
const INTERNAL_ROLE_KEY = 'dekode_internal_kb_role';
const TEAM_PASSWORD = 'deko1234';
const CLIENT_PASSWORD = 'client1234';

const MODULES = [
  {
    id: 'induction',
    num: '01',
    title: 'Induction',
    tag: 'Guide',
    tier: 'internal',
    section: 'Induction',
    status: 'Ready',
    statusLabel: 'Ready',
    updated: 'Oct 2026',
    icon: ShieldCheck,
    accent: '#0B3D91',
    accentBg: 'rgba(11, 61, 145, 0.14)',
    desc: 'Welcome to DEKODE, how we work, team setup and day-one checklist.'
  },
  {
    id: 'standards',
    num: '02',
    title: 'Engineering Best Practices',
    tag: 'Guide',
    tier: 'internal',
    section: 'Coding Standards',
    status: 'Ready',
    statusLabel: 'Ready',
    updated: 'Oct 2026',
    icon: Code2,
    accent: '#B45309',
    accentBg: 'rgba(180, 83, 9, 0.14)',
    desc: 'Coding best practices, Git hygiene, security and testing benchmarks.'
  },
  {
    id: 'optiflow',
    logo: optiFlowLogo,
    num: '03',
    title: 'OptiFlow',
    tag: 'Architecture',
    tier: 'internal',
    section: 'Products',
    status: 'Ready',
    statusLabel: 'Ready',
    updated: 'Oct 2026',
    icon: Layers,
    accent: '#22d3ee',
    accentBg: 'rgba(34, 211, 238, 0.12)',
    desc: 'Distribution engine, FIFO allocation, diagrams and contributor guide.'
  },
  {
    id: 'krafc',
    logo: krafcLogo,
    num: '04',
    title: 'krafc',
    tag: 'Spec',
    tier: 'internal',
    section: 'Products',
    status: 'Ready',
    statusLabel: 'Ready',
    updated: 'Oct 2026',
    icon: PackageCheck,
    accent: '#0ea5e9',
    accentBg: 'rgba(14, 165, 233, 0.12)',
    desc: 'Dual-engine Konva/BabylonJS architecture, spatial math and specs.'
  },
  {
    id: 'kopal',
    logo: kopalLogo,
    num: '05',
    title: 'KOPAL',
    tag: 'Platform',
    tier: 'internal',
    section: 'Platforms',
    status: 'Ready',
    statusLabel: 'Ready',
    updated: 'Oct 2026',
    icon: Sparkles,
    accent: '#a78bfa',
    accentBg: 'rgba(167, 139, 250, 0.12)',
    desc: 'Dual-interface Flutter platform, Go + Vertex AI backend, Firestore realtime control plane.'
  },
  {
    id: 'client-optiflow',
    logo: optiFlowLogo,
    num: 'C1',
    title: 'OptiFlow',
    tag: 'Guide',
    tier: 'external',
    section: 'Products',
    status: 'Ready',
    statusLabel: 'Ready',
    updated: 'Oct 2026',
    icon: Layers,
    accent: '#22d3ee',
    accentBg: 'rgba(34, 211, 238, 0.12)',
    desc: 'Product tour, live prototype, FAQs and onboarding info.'
  },
  {
    id: 'client-krafc',
    logo: krafcLogo,
    num: 'C2',
    title: 'krafc',
    tag: 'Guide',
    tier: 'external',
    section: 'Products',
    status: 'Ready',
    statusLabel: 'Ready',
    updated: 'Oct 2026',
    icon: PackageCheck,
    accent: '#0ea5e9',
    accentBg: 'rgba(14, 165, 233, 0.12)',
    desc: 'Product tour, live platform preview, FAQs and project flow.'
  },
  {
    id: 'client-kopal',
    logo: kopalLogo,
    num: 'C3',
    title: 'KOPAL',
    tag: 'Platform',
    tier: 'external',
    section: 'Platforms',
    status: 'Ready',
    statusLabel: 'Ready',
    updated: 'Oct 2026',
    icon: Sparkles,
    accent: '#a78bfa',
    accentBg: 'rgba(167, 139, 250, 0.12)',
    desc: 'Immersive AI literacy ecosystem for children - session journey, system overview and FAQs.'
  }
];

const SECTION_ORDER = ['Induction', 'Coding Standards', 'Products', 'Platforms'];

const HUB_PATH = '/team-kb-d7x9q2';
const docPath = (id) => `${HUB_PATH}/doc/${id}`;
const docIdFromPath = () => {
  const m = window.location.pathname.match(/\/team-kb-d7x9q2\/doc\/([a-z-]+)/);
  return m ? m[1] : null;
};

export default function InternalKnowledgeBase({ _secretPath = '/internal-kb-d7x9q2' }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem(INTERNAL_AUTH_KEY) === 'authenticated';
  });
  const [theme] = useState('light');
  const [passwordInput, setPasswordInput] = useState('');
  const [portalTab, setPortalTab] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(() => {
    const id = docIdFromPath();
    return MODULES.find((m) => m.id === id && m.status === 'Ready' && DOC_COMPONENTS[id]) || null;
  });
  const [role, setRole] = useState(() => {
    return sessionStorage.getItem(INTERNAL_ROLE_KEY) || 'internal';
  });
  const [query, setQuery] = useState('');

  const isLight = true;

  const handleThemeChange = () => {};

  // Browser / mobile back button support: each doc is its own page
  useEffect(() => {
    const onPop = () => {
      const id = docIdFromPath();
      setSelectedDoc(MODULES.find((m) => m.id === id && m.status === 'Ready' && DOC_COMPONENTS[id]) || null);
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const openDoc = (item) => {
    window.history.pushState({ kbDoc: item.id }, '', docPath(item.id));
    setSelectedDoc(item);
    window.scrollTo(0, 0);
  };

  const goHub = () => {
    window.history.pushState({ kbDoc: null }, '', HUB_PATH);
    setSelectedDoc(null);
    window.scrollTo(0, 0);
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
    window.history.replaceState({ kbDoc: null }, '', HUB_PATH);
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

  // 1. Password Lock Gate - blue, white DEKODE logo, portal picker then password
  if (!isAuthenticated) {
    return (
      <div style={{
        width: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #08203C 0%, #04101f 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        boxSizing: 'border-box',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        position: 'relative'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '380px',
          textAlign: 'center'
        }}>
          <div className="brand-logo" style={{
            display: 'block',
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800,
            fontSize: '28px',
            letterSpacing: '1px',
            color: '#ffffff',
            textTransform: 'uppercase',
            textAlign: 'center',
            marginBottom: '4px'
          }}>
            DEKODE
          </div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: '24px', textAlign: 'center' }}>
            Knowledge Base
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '20px',
            padding: '28px 24px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
            backdropFilter: 'blur(12px)',
            minHeight: '236px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            {!portalTab ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { id: 'internal', label: 'Internal Team' },
                { id: 'client', label: 'Client Portal' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => { setPortalTab(p.id); setErrorMsg(''); setPasswordInput(''); }}
                  style={{
                    width: '100%',
                    padding: '13px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #ffd34d 0%, #FFB611 50%, #e69a00 100%)',
                    color: '#080d1a',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
            ) : (
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <button
                    type="button"
                    onClick={() => { setPortalTab(null); setErrorMsg(''); setPasswordInput(''); }}
                    aria-label="Back"
                    style={{ background: 'none', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '8px', color: '#ffffff', fontSize: '14px', fontWeight: 700, cursor: 'pointer', padding: '6px 12px' }}
                  >
                    ←
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder={portalTab === 'internal' ? 'Team password' : 'Client password'}
                    autoFocus
                    onFocus={(e) => { e.target.style.borderColor = t.gold; e.target.style.boxShadow = '0 0 0 3px rgba(255, 182, 17, 0.25)'; }}
                    onBlur={(e) => { e.target.style.borderColor = errorMsg ? '#ef4444' : '#cbd5e1'; e.target.style.boxShadow = 'none'; }}
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 38px',
                      backgroundColor: '#f8fafc',
                      border: errorMsg ? '1px solid #ef4444' : '1px solid #cbd5e1',
                      borderRadius: '10px',
                      color: '#0f172a',
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
              Enter
            </button>
          </form>
            )
          }
          </div>
        </div>
      </div>
    );
  }

  // 2. Native React Document Reader (own page per doc)
  if (selectedDoc) {
    const DocComponent = DOC_COMPONENTS[selectedDoc.id];
    const docRole = selectedDoc.tier === 'external' ? 'Client' : 'Internal';
    if (DocComponent) {
      return (
        <DocComponent
          theme={theme}
          onThemeChange={handleThemeChange}
          onNavigateHome={goHub}
        />
      );
    }
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
          </div>
        </header>

        {/* Fallback (should not happen - all docs have React components) */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Document not found.</p>
        </div>
      </div>
    );
  }

  // 3. Clean & Minimalist Knowledge Base Hub (Mobile First, No Fluff)
  // View is driven by login role: team password shows internal docs,
  // client password shows client-safe docs. No manual switching.
  const visibleModules = MODULES.filter((m) => (m.tier || 'internal') === role);
  const isClient = role === 'external';
  const q = query.trim().toLowerCase();
  const filtered = q ? visibleModules.filter((m) => `${m.title} ${m.desc} ${m.tag}`.toLowerCase().includes(q)) : visibleModules;
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: t.bg,
      color: t.text,
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      boxSizing: 'border-box'
    }}>
      {/* Blue Header */}
      <header style={{
        background: 'linear-gradient(180deg, #0a3d91 0%, #0b2f6e 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.14)',
        position: 'sticky',
        top: 0,
        zIndex: 20
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.55rem', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.01em', color: '#ffffff' }}>
              DEKODE
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleLogout}
              title="Log out of Knowledge Base"
              aria-label="Log out of Knowledge Base"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: '#ffffff',
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
        maxWidth: '800px',
        margin: '0 auto',
        padding: '40px 24px 48px'
      }}>
        {/* Minimal Hero Header */}
        <div style={{ marginBottom: '16px' }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 800,
            margin: '0 0 8px',
            letterSpacing: '-0.01em',
            color: t.text
          }}>
            {isClient ? 'Client Knowledge Base' : 'Engineering Knowledge Base'}
          </h1>
          <p style={{
            fontSize: '15px',
            color: t.textMuted,
            margin: 0,
            lineHeight: '1.5'
          }}>
            {isClient ? 'Product guides, manuals and release notes.' : 'Internal technical specifications, guidelines, and product guides.'}
          </p>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search docs…"
            aria-label="Search docs"
            style={{ width: '100%', boxSizing: 'border-box', padding: '12px 16px', borderRadius: '12px', border: `1px solid ${t.border}`, fontSize: '15px', outline: 'none', background: t.surface, color: t.text }}
          />
        </div>

        {/* Grouped Module Sections */}
        {SECTION_ORDER.map((section) => {
          const items = filtered.filter((m) => (m.section || 'Products') === section);
          if (!items.length) return null;
          return (
            <div key={section} style={{ marginBottom: '32px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5b6478', margin: '32px 0 12px' }}>
                {section}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {items.map((item) => {
            const Icon = item.icon;
            const isReady = item.status === 'Ready';
            const accent = item.accent || t.gold;
            const accentBg = item.accentBg || t.goldBg;

            const cardProps = isReady ? {
              role: 'link', tabIndex: 0,
              onClick: () => openDoc(item),
              onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDoc(item); } },
            } : { 'aria-disabled': true };
            return (
              <div
                key={item.id}
                {...cardProps}
                style={{
                  background: t.surface,
                  borderRadius: '16px',
                  border: '1px solid #e5e7ee',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  cursor: isReady ? 'pointer' : 'default',
                  opacity: isReady ? 1 : 0.65,
                  transition: 'transform .15s, box-shadow .15s, border-color .15s',
                  userSelect: 'none',
                  outline: 'none'
                }}
                onMouseEnter={(e) => {
                  if (isReady) {
                    e.currentTarget.style.borderColor = '#c7cce0';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(20, 30, 80, .08)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7ee';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 3px rgba(11,61,145,.35)'; }}
                onBlur={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
              >
                {/* Uniform 48px left icon */}
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: item.logo ? '#fff' : accentBg,
                  border: '1px solid #e5e7ee',
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                  overflow: 'hidden',
                  boxSizing: 'border-box'
                }}>
                  {item.logo
                    ? <img src={item.logo} alt={`${item.title} logo`} style={{ width: '38px', height: '38px', objectFit: 'contain' }} />
                    : <Icon size={22} color={accent} />}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: t.text, letterSpacing: '-0.01em' }}>
                      {item.title}
                    </h2>
                  </div>
                  <p style={{ fontSize: '15px', color: t.textMuted, margin: '0 0 4px', lineHeight: '1.5' }}>
                    {item.desc}
                  </p>
                  <div style={{ fontSize: '12px', color: '#5b6478' }}>Updated {item.updated}</div>
                </div>

                {isReady && (
                  <span data-arrow style={{ color: t.textDim, display: 'flex', alignItems: 'center', flexShrink: 0, alignSelf: 'center' }}>
                    <ChevronRight size={20} />
                  </span>
                )}
              </div>
            );
          })}
              </div>
            </div>
          );
        })}

        {/* Minimal Footer */}
        <div style={{
          marginTop: '32px',
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
