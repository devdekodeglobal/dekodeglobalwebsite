import React, { useState } from 'react';
import '../orig/client-standards.css';
import '../orig/kb-override.css';

/** KOPAL - client & executive overview. Same UI shell as client overviews. */
const NAV = [
  { group: 'Overview', links: [
    { id: 'summary', label: 'Executive Summary' },
    { id: 'journey', label: '5-Stage Session Journey' },
  ]},
  { group: 'Experience', links: [
    { id: 'system', label: 'Dual-Interface System' },
    { id: 'benefits', label: 'Value Propositions' },
  ]},
  { group: 'Info', links: [
    { id: 'faq', label: 'FAQs' },
  ]},
];

function Shell({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const q = query.toLowerCase();
  const filtered = NAV.map((g) => ({ ...g, links: g.links.filter((l) => l.label.toLowerCase().includes(q)) })).filter((g) => g.links.length);
  return (
    <div className="kb-orig kb-orig-client-standards" data-theme="light">
      <header className="mobile-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <a className="brand-logo" href="/team-kb-d7x9q2" target="_top" title="Back to documents hub">DEKODE</a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>Menu</button>
        </div>
      </header>
      <div className={`sidebar-backdrop${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(false)} />
      <aside className={`sidebar${menuOpen ? ' open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-container">
            <a className="brand-logo" href="/team-kb-d7x9q2" target="_top" title="Back to documents hub">DEKODE</a>
          </div>
          <div className="search-wrapper">
            <input type="text" className="sidebar-search" placeholder="Search kopal overview..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </div>
        <nav id="nav-container">
          {filtered.map((g) => (
            <React.Fragment key={g.group}>
              <div className="nav-group-title">{g.group}</div>
              <ul className="nav-links">
                {g.links.map((l) => <li key={l.id}><a href={`#${l.id}`} onClick={() => setMenuOpen(false)}>{l.label}</a></li>)}
              </ul>
            </React.Fragment>
          ))}
        </nav>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}

export default function ClientKopal() {
  return (
    <Shell>
      <header className="hero-banner">
        <div className="hero-title">KOPAL<br /><span>Client &amp; Executive Overview</span></div>
        <p className="hero-desc"><strong>"The world's first emotional AI literacy ecosystem for children. Guided by humans. Powered by imagination."</strong></p>
      </header>

      <section id="summary" style={{ marginBottom: '40px' }}>
        <div className="section-header"><span className="section-num">1</span><h2 className="section-title">Executive Summary</h2></div>
        <p><strong>KOPAL</strong> is an immersive, multi-sensory educational ecosystem for early-childhood and primary-age learners. Instead of treating AI as a solitary screen-time tool, KOPAL introduces children to AI as an <strong>empathetic, creative partner</strong> - through storytelling, emotional reflection, and physical movement.</p>
        <h3>Core Philosophy</h3>
        <div className="grid-2">
          <div className="card"><h3>Human-First</h3><p>Technology never replaces the facilitator - a trained adult guides, mediates, and supports emotional well-being.</p></div>
          <div className="card"><h3>Emotion-Aware</h3><p>Children learn emotional vocabulary (calm, excited, anxious, frustrated, proud) before or alongside digital interactions.</p></div>
          <div className="card"><h3>Imagination-Driven</h3><p>Children's ideas and physical drawings shape the environment - AI brings their creations to life dynamically.</p></div>
          <div className="card"><h3>Co-Creation</h3><p>AI as collaborative canvas reacting to input - not an authoritative source of truth.</p></div>
        </div>
      </section>

      <section id="journey" style={{ marginBottom: '40px' }}>
        <div className="section-header"><span className="section-num">2</span><h2 className="section-title">The 5-Stage Session Journey</h2></div>
        <p>Every KOPAL workshop or classroom session follows a scientifically designed pedagogy:</p>
        <div className="arch-diagram">
          <svg viewBox="0 0 720 150" style={{ width: '100%', height: 'auto', display: 'block' }} role="img" aria-label="5-stage session journey">
            <line x1="40" y1="60" x2="680" y2="60" stroke="#FFB611" strokeWidth="3" />
            {[['1', 'Arrive', 'Wonder'], ['2', 'Connect', 'Check-in'], ['3', 'Imagine', 'Story'], ['4', 'Create', 'Co-create'], ['5', 'Reflect', 'Confidence']].map(([n, t, s], i) => {
              const x = 70 + i * 145;
              return (
                <g key={n}>
                  <circle cx={x} cy="60" r="26" fill="#FFB611" />
                  <text x={x} y="67" textAnchor="middle" fontSize="20" fontWeight="800" fill="#000">{n}</text>
                  <text x={x} y="108" textAnchor="middle" fontSize="13" fontWeight="800" fill="currentColor">{t}</text>
                  <text x={x} y="126" textAnchor="middle" fontSize="11" fill="currentColor" opacity="0.7">{s}</text>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="table-container">
          <table>
            <thead><tr><th>Phase</th><th>What Happens</th><th>Outcome</th></tr></thead>
            <tbody>
              <tr><td><strong>1. Arrive</strong></td><td>Transformed space: ambient lighting, calming soundscapes, welcoming projections.</td><td>De-escalates overwhelm, sparks curiosity, focuses attention.</td></tr>
              <tr><td><strong>2. Connect</strong></td><td>Emotional check-in (meeting "Floof", KOPAL's companion) - children express how they feel.</td><td>Self-awareness, emotional articulation, psychological safety.</td></tr>
              <tr><td><strong>3. Imagine</strong></td><td>Interactive storytelling; visuals, mood colors and character reactions shift in real time.</td><td>Narrative comprehension, empathy, collective decision-making.</td></tr>
              <tr><td><strong>4. Create</strong></td><td>Children draw, craft, or describe worlds - captured and converted into dynamic textures via generative AI.</td><td>Demystifies AI; agency over passivity.</td></tr>
              <tr><td><strong>5. Reflect</strong></td><td>Group reflection, celebrating artwork, grounding exercises.</td><td>Emotional resilience, SEL gains, creative confidence.</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="system" style={{ marginBottom: '40px' }}>
        <div className="section-header"><span className="section-num">3</span><h2 className="section-title">Dual-Interface System</h2></div>
        <p>Two synchronized interfaces working together in real-world spaces:</p>
        <div className="arch-diagram">
          <svg viewBox="0 0 720 210" style={{ width: '100%', height: 'auto', display: 'block' }} role="img" aria-label="dual-interface system">
            <rect x="20" y="55" width="200" height="100" rx="12" fill="none" stroke="#FFB611" strokeWidth="2" />
            <text x="36" y="85" fontSize="13" fontWeight="800" fill="currentColor">FACILITATOR REMOTE</text>
            <text x="36" y="105" fontSize="12" fill="currentColor">Tablet · command center</text>
            <text x="36" y="125" fontSize="12" fill="currentColor">Kids never touch it</text>
            <rect x="260" y="55" width="200" height="100" rx="12" fill="none" stroke="#22d3ee" strokeWidth="2" />
            <text x="276" y="85" fontSize="13" fontWeight="800" fill="currentColor">SECURE CLOUD</text>
            <text x="276" y="105" fontSize="12" fill="currentColor">Sync + AI generation</text>
            <text x="276" y="125" fontSize="12" fill="currentColor">Anonymous sessions</text>
            <rect x="500" y="55" width="200" height="100" rx="12" fill="none" stroke="#4EE3AA" strokeWidth="2" />
            <text x="516" y="85" fontSize="13" fontWeight="800" fill="currentColor">MAGIC CANVAS</text>
            <text x="516" y="105" fontSize="12" fill="currentColor">Projector · room-scale</text>
            <text x="516" y="125" fontSize="12" fill="currentColor">No buttons, no clutter</text>
            <line x1="220" y1="95" x2="260" y2="95" stroke="#FFB611" strokeWidth="2" />
            <polygon points="250,89 260,95 250,101" fill="#FFB611" />
            <line x1="460" y1="95" x2="500" y2="95" stroke="#22d3ee" strokeWidth="2" />
            <polygon points="490,89 500,95 490,101" fill="#22d3ee" />
            <text x="360" y="185" textAnchor="middle" fontSize="12" fill="currentColor" opacity="0.75">Mood, story &amp; artwork flow both ways in under a second</text>
          </svg>
        </div>
        <div className="card">
          <h3>A. Facilitator Remote (Command Center)</h3>
          <p><strong>Device:</strong> tablet or laptop, facilitator-only - children never touch this screen. Select curriculum modules (<em>Floof's Magic Forest</em>, <em>Floof's First Flight</em>, <em>Bodyland</em>, <em>Big Feelings</em>), advance story beats, trigger physical actions ("Stomp", "Whisper", "Fly"), modulate room mood (Calm → Excited), snap artwork photos for background generation.</p>
        </div>
        <div className="card">
          <h3>B. Projector Display (Magic Canvas)</h3>
          <p><strong>Device:</strong> HD ultra-wide or multi-wall projection. Borderless, distraction-free - no buttons or menus. Fluid mesh gradients, physics-driven particle orbs reacting to mood, the Floof companion avatar with synced speech and subtitles, and live AI texture rendering of children's drawings at room scale.</p>
        </div>
      </section>

      <section id="benefits" style={{ marginBottom: '40px' }}>
        <div className="section-header"><span className="section-num">4</span><h2 className="section-title">Key Value Propositions</h2></div>
        <div className="table-container">
          <table>
            <thead><tr><th>Stakeholder</th><th>Key Benefit</th></tr></thead>
            <tbody>
              <tr><td><strong>Children</strong></td><td>Safe, positive AI introduction without personal devices · emotional literacy &amp; self-regulation · creative confidence from seeing art at room scale.</td></tr>
              <tr><td><strong>Educators</strong></td><td>Zero-stress orchestration via one intuitive remote · ready-made research-backed SEL + digital-literacy modules · physically active, face-to-face engagement.</td></tr>
              <tr><td><strong>Schools</strong></td><td>Turnkey setup on standard projection + tablet hardware · forefront of safe, responsible AI education · privacy-first, anonymous sessions, enterprise cloud hosting.</td></tr>
            </tbody>
          </table>
        </div>
        <h3>Curriculum Modules at Launch</h3>
        <div className="grid-2">
          <div className="card"><h3>Floof's First Flight</h3><p>Onboarding adventure - children meet Floof and learn their first check-in.</p></div>
          <div className="card"><h3>Floof's Magic Forest</h3><p>Flagship storytelling + co-creation journey through a living forest.</p></div>
          <div className="card"><h3>Bodyland</h3><p>Movement-led module - stomp, whisper, fly; body awareness through play.</p></div>
          <div className="card"><h3>Big Feelings</h3><p>Emotional vocabulary builder - naming calm, excitement, frustration and pride.</p></div>
        </div>
        <h3>Safety by Design</h3>
        <div className="callout callout-success" style={{ margin: '14px 0 20px;' }}>
          <strong>No accounts. No PII. No personal devices.</strong> Sessions run anonymously, artwork photos are processed in isolated containers solely to generate session textures, and everything is governed by enterprise compliance policies.
        </div>
      </section>

      <section id="faq" style={{ marginBottom: '40px' }}>
        <div className="section-header"><span className="section-num">5</span><h2 className="section-title">FAQs</h2></div>
        <div className="card"><h3>Do children use iPads, phones, or headsets?</h3><p>No. KOPAL is intentionally non-personal-device - children face each other, move physically, and share one projector canvas. No screen addiction, no isolation.</p></div>
        <div className="card"><h3>Is children's data or photos saved or shared?</h3><p>Privacy and child safety come first. Sessions are anonymous - no accounts, no PII. Drawing photos are processed in isolated cloud containers solely to generate session textures, under enterprise compliance.</p></div>
        <div className="card"><h3>What space and equipment is required?</h3><p>1. Quiet room/studio with dimmable lighting · 2. Projector or large display + speakers · 3. One computer driving the projector · 4. One tablet (or Chrome) for the facilitator · 5. Standard Wi-Fi.</p></div>
      </section>
    </Shell>
  );
}
