import React, { useState } from 'react';
import '../orig/internal-standards.css';
import '../orig/kb-override.css';

/**
 * Team Induction - same UI shell as the Company Standards guide
 * (scoped original CSS), with induction content: checklist, team notes,
 * brand consistency guide and setup info.
 */
const NAV = [
  { group: 'Getting Started', links: [
    { id: 'welcome', label: 'Welcome & Checklist' },
  ]},
  { group: 'Team Notes', links: [
    { id: 'staying-connected', label: 'Staying Connected as a Team' },
    { id: 'building-brand', label: 'Building a Brand' },
  ]},
  { group: 'Brand & STAR', links: [
    { id: 'brand-consistency', label: 'Brand Consistency Guide' },
    { id: 'star-framework', label: 'Our STAR Framework' },
  ]},
  { group: 'Setup', links: [
    { id: 'setup-access', label: 'Setup, Access & Day One' },
    { id: 'faq', label: 'FAQs' },
  ]},
];

export default function InternalInduction() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const q = query.toLowerCase();
  const filtered = NAV.map((g) => ({
    ...g,
    links: g.links.filter((l) => l.label.toLowerCase().includes(q)),
  })).filter((g) => g.links.length);

  return (
    <div className="kb-orig kb-orig-internal-standards" data-theme="light">
      <header className="mobile-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <a className="brand-logo" href="/team-kb-d7x9q2" target="_top" title="Back to documents hub">DEKODE</a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <a href="/team-kb-d7x9q2" target="_top" title="Back to documents hub" className="mobile-menu-btn"
            style={{ textDecoration: 'none' }}>Back</a>
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>Menu</button>
        </div>
      </header>

      <div className={`sidebar-backdrop${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(false)} />

      <aside className={`sidebar${menuOpen ? ' open' : ''}`} id="sidebar">
        <div className="sidebar-header">
          <div className="brand-container">
            <a className="brand-logo" href="/team-kb-d7x9q2" target="_top" title="Back to documents hub">DEKODE</a>
          </div>
          <div className="search-wrapper">
            <input type="text" className="sidebar-search" placeholder="Search induction..."
              value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </div>
        <nav id="nav-container">
          {filtered.map((g) => (
            <React.Fragment key={g.group}>
              <div className="nav-group-title">{g.group}</div>
              <ul className="nav-links">
                {g.links.map((l) => (
                  <li key={l.id}><a href={`#${l.id}`} onClick={() => setMenuOpen(false)}>{l.label}</a></li>
                ))}
              </ul>
            </React.Fragment>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <header className="hero-banner">
          <div className="hero-title">
            Team Induction<br />
            <span>Your DEKODE Starting Pack &amp; Team Handbook</span>
          </div>
          <p className="hero-desc">
            Everything a new team member needs: the induction checklist, how we communicate,
            how we think about brand, and the STAR standard we hold ourselves to.
          </p>
        </header>

        <section id="welcome" style={{ marginBottom: '40px' }}>
          <div className="section-header">
            <span className="section-num">✓</span>
            <h2 className="section-title">Induction Checklist</h2>
          </div>
          <p>Work through each item in order. Check them off as you go - and ask in the project channel if anything is unclear.</p>
          <div className="table-container">
            <table>
              <thead><tr><th>#</th><th>Item</th><th>What To Do</th><th>Done</th></tr></thead>
              <tbody>
                <tr><td>1</td><td>DEKODE Website</td><td>Read through www.dekodeglobal.com - not as a task, but as orientation. It is the clearest articulation of who we are and what we stand for.</td><td>☐</td></tr>
                <tr><td>2</td><td>DEKODE LinkedIn Company Page</td><td>Follow the page, connect with the team, and keep your own profile current.</td><td>☐</td></tr>
                <tr><td>3</td><td>Staying Connected as a Team</td><td>Read the team note below on communication and availability.</td><td>☐</td></tr>
                <tr><td>4</td><td>STAR from Start</td><td>Read the brand consistency guide below - names, fonts, copy, and the STAR framework.</td><td>☐</td></tr>
                <tr><td>5</td><td>LinkedIn Visibility</td><td>Engage with DEKODE posts (like, comment, reshare) so our work reaches further.</td><td>☐</td></tr>
                <tr><td>6</td><td>Building a Brand</td><td>Read the creators-not-just-developers note below and bring that mindset from day one.</td><td>☐</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="staying-connected" style={{ marginBottom: '40px' }}>
          <div className="section-header">
            <span className="section-num">✉</span>
            <h2 className="section-title">Staying Connected as a Team</h2>
          </div>
          <div className="card">
            <p>A quick note on something important - <strong>communication</strong>.</p>
            <p>We understand that life happens. Plans change, situations arise, and sometimes things are only known at the last minute. That is completely okay. What matters is that we keep each other informed.</p>
            <p>When your availability changes - for any reason - please let the team know as early as you can. A short message is all it takes. It helps everyone plan better, avoids guesswork, and means we can support you rather than chase you.</p>
            <p>We are not here to micromanage. We trust you and we believe in work-life balance - genuinely. But work and team commitments matter too, and a heads-up goes a long way. Especially when others are depending on your input to move forward.</p>
            <p>If something comes up, just say so. We will always find a way to work it out together.</p>
            <p>Let us keep communication simple, open, and honest - that is the DEKODE way.</p>
          </div>
        </section>

        <section id="building-brand" style={{ marginBottom: '40px' }}>
          <div className="section-header">
            <span className="section-num">◈</span>
            <h2 className="section-title">Building a Brand: Think Like Creators, Not Just Developers</h2>
          </div>
          <div className="card">
            <p>Building a product - and a brand - has always been an evolving process. It never stays still, and neither should we.</p>
            <p>I want all of us to start thinking and acting like <strong>creators, not just developers</strong>. If we don't genuinely perceive, feel, and own why we're building something, how do we ever differentiate ourselves? How do we evolve?</p>
            <p>Whatever we create, the first step is always the same: <strong>put ourselves in the user's shoes</strong>. Ask honestly - is this what I'd want? Does it make my life easier? Does it save me time, effort, or money? If the answer isn't a clear yes, we're not done yet.</p>
            <p>And here's the mindset shift I want us to carry forward: <strong>don't wait to be told what to do</strong>. Don't just follow instructions and stop there. Be proactive. Be forward-thinking. If you have an idea, a suggestion, a better way - speak up. Share it. This is how we build something that stands apart.</p>
            <p><strong>Let's create.</strong></p>
          </div>
        </section>

        <section id="brand-consistency" style={{ marginBottom: '40px' }}>
          <div className="section-header">
            <span className="section-num">★</span>
            <h2 className="section-title">STAR from the Start - Brand Consistency Guide</h2>
          </div>
          <p><em>From all of us, to all of us.</em></p>
          <div className="callout callout-info" style={{ margin: '14px 0 20px;' }}>
            <strong>Brand consistency is not about aesthetics. It is about trust.</strong> Every name, every font choice, every line of copy we put out is a signal. It tells our clients, our partners, and everyone who encounters us: we are attentive, we are professional, and we mean it.
          </div>
          <p>There is a small but important habit we need to build together - and the sooner we start, the more natural it becomes.</p>
          <h3>How our brands are written - always, without exception</h3>
          <div className="table-container">
            <table>
              <thead><tr><th>Brand / Platform</th><th>Correct usage</th><th>Rule</th></tr></thead>
              <tbody>
                <tr><td>DEKODE</td><td>DEKODE</td><td>All caps - always</td></tr>
                <tr><td>DEKODE Global</td><td>DEKODE Global</td><td>All caps for DEKODE - always</td></tr>
                <tr><td>KOPAL</td><td>KOPAL</td><td>All caps - always</td></tr>
                <tr><td>krafc</td><td>krafc</td><td>All lowercase - always</td></tr>
                <tr><td>OptiFlow</td><td>OptiFlow</td><td>O and F capital - always</td></tr>
              </tbody>
            </table>
          </div>
          <div className="callout callout-warning" style={{ margin: '14px 0 20px;' }}>
            <strong>This applies everywhere</strong> - email subject lines, meeting invites, messages, LinkedIn posts, pitch decks, proposals, and casual internal notes. There is no informal setting where brand names get a pass.
          </div>
        </section>

        <section id="star-framework" style={{ marginBottom: '40px' }}>
          <div className="section-header">
            <span className="section-num">S</span>
            <h2 className="section-title">Our STAR Framework: It Starts Here</h2>
          </div>
          <p>STAR is not a tagline. It is the standard we hold ourselves to, in every interaction - big and small.</p>
          <div className="grid-2">
            <div className="card"><h3>S - Simple</h3><p>Clear names, clean copy, no clutter - in every communication.</p></div>
            <div className="card"><h3>T - Transparent</h3><p>Consistent presentation builds trust before a word is read.</p></div>
            <div className="card"><h3>A - Accountable</h3><p>Each of us carries the brand. Every touchpoint is our shared responsibility.</p></div>
            <div className="card"><h3>R - Reliable</h3><p>Consistency is reliability made visible. People trust what they can predict.</p></div>
          </div>
          <div className="callout callout-success" style={{ margin: '14px 0 20px;' }}>
            <strong>A typo in a brand name is a small thing. But small things, repeated, shape perception.</strong> Our attention to detail is the first proof of our reliability - before a proposal is read, before a meeting is held.
          </div>
          <p>We are all on this journey together - learning, evolving, building something we can be proud of. None of this is about perfection. It is about intention.</p>
          <p><strong>If we start, we get there. If we don't start, we don't.</strong> Let us be the standard we set for ourselves. STAR is not just what we promise our clients - it is how we show up for each other.</p>
          <p>- Team DEKODE Global</p>
          <div className="card" style={{ marginTop: '20px' }}>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>
              DEKODE Global LLP | T +91 88828 48489 | E contactus@dekodeglobal.com<br />
              B-2/87 Janak Puri, New Delhi 110058, India<br />
              W www.dekodeglobal.com · CONFIDENTIAL
            </p>
          </div>
        </section>

        <section id="setup-access" style={{ marginBottom: '40px' }}>
          <div className="section-header">
            <span className="section-num">⚙</span>
            <h2 className="section-title">Setup, Access &amp; Day One</h2>
          </div>
          <p>Get provisioned on each of these, then confirm access with your lead:</p>
          <div className="table-container">
            <table>
              <thead><tr><th>System</th><th>Used For</th><th>Granted By</th></tr></thead>
              <tbody>
                <tr><td>GitHub org &amp; repos</td><td>Code, PRs, CI</td><td>Team lead invite</td></tr>
                <tr><td>Project channels</td><td>Daily comms, standups</td><td>Team lead invite</td></tr>
                <tr><td>Hosting &amp; dashboards</td><td>Previews, logs, deploys</td><td>Team lead invite</td></tr>
                <tr><td>Knowledge Base</td><td>Guides, standards, runbooks</td><td>You are here</td></tr>
              </tbody>
            </table>
          </div>
          <div className="callout callout-danger" style={{ margin: '14px 0 20px;' }}>
            <strong>Secrets rule:</strong> never commit secrets or share credentials in chat. Env via secret store only - ask your lead for the provisioning flow.
          </div>
          <p><strong>Short version of the bar</strong> (full details in Engineering Best Practices): small PRs · conventional commits · tests with every change · one approval minimum · green CI · no direct pushes to main.</p>
        </section>

        <section id="faq" style={{ marginBottom: '40px' }}>
          <div className="section-header">
            <span className="section-num">?</span>
            <h2 className="section-title">FAQs</h2>
          </div>
          <div className="card"><h3>Who do I ask when I'm stuck?</h3><p>Your buddy first, then the project channel. Timebox solo debugging to ~30 minutes before asking.</p></div>
          <div className="card"><h3>Where do I find product docs?</h3><p>Right here - Products section (OptiFlow, krafc) and Platforms section (KOPAL) of this hub.</p></div>
          <div className="card"><h3>How do I write our brand names?</h3><p>DEKODE and DEKODE Global in caps; KOPAL in caps; krafc all lowercase; OptiFlow with capital O and F. Everywhere, no exceptions.</p></div>
        </section>
      </main>
    </div>
  );
}
