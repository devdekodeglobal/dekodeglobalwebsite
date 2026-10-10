import React, { useState } from 'react';
import '../orig/internal-standards.css';
import '../orig/kb-override.css';

/**
 * KOPAL - internal engineering guide.
 * Same structure/conventions as the OptiFlow & krafc developer guides:
 * numbered sections under Architecture / Data Models / Quality /
 * Playbooks / Operations.
 */
const NAV = [
  { group: 'System Architecture & Design Docs', links: [
    { id: 'vision', label: '01. Vision & Problem Statement' },
    { id: 'dual-interface', label: '02. Dual-Interface Architecture' },
    { id: 'journey', label: '03. Session Journey & Pedagogy' },
    { id: 'remote', label: '04. Facilitator Remote (Flutter)' },
    { id: 'display', label: '05. Projector Display (Flutter)' },
    { id: 'website', label: '06. Marketing App (React)' },
    { id: 'architecture', label: '07. Architecture Diagram' },
    { id: 'mood-palette', label: '08. Mood Palette Contract' },
  ]},
  { group: 'API, Security & Data Models', links: [
    { id: 'state-protocol', label: '09. State Protocol & Schema' },
    { id: 'api', label: '10. HTTP API Endpoints' },
    { id: 'modules', label: '11. Module Catalog & Data Models' },
    { id: 'security', label: '12. Auth, Privacy & Safety Gates' },
  ]},
  { group: 'Coding Standards & Code Quality', links: [
    { id: 'testing', label: '13. Testing & Verification' },
    { id: 'quality', label: '14. Code Quality & Security' },
  ]},
  { group: 'Contributor & Onboarding Playbooks', links: [
    { id: 'taxonomy', label: '15. Codebase Taxonomy' },
    { id: 'setup', label: '16. 5-Min Developer Setup' },
    { id: 'recipe-module', label: '17. Recipe: Add Curriculum Module' },
    { id: 'recipe-mood', label: '18. Recipe: Add a Mood' },
  ]},
  { group: 'Operations, CI/CD & Runbooks', links: [
    { id: 'deployment', label: '19. Deployment & Runbook' },
    { id: 'troubleshooting', label: '20. Troubleshooting' },
  ]},
];

function Shell({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const q = query.toLowerCase();
  const filtered = NAV.map((g) => ({ ...g, links: g.links.filter((l) => l.label.toLowerCase().includes(q)) })).filter((g) => g.links.length);
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
      <aside className={`sidebar${menuOpen ? ' open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-container">
            <a className="brand-logo" href="/team-kb-d7x9q2" target="_top" title="Back to documents hub">DEKODE</a>
            <a href="/team-kb-d7x9q2" target="_top" title="Back to documents hub"
              style={{ fontSize: '13px', fontWeight: 700, textDecoration: 'none', border: '1px solid var(--border, #dbe4f5)', borderRadius: '8px', padding: '4px 10px', color: 'inherit', whiteSpace: 'nowrap' }}>Back</a>
          </div>
          <div className="search-wrapper">
            <input type="text" className="sidebar-search" placeholder="Search kopal guide..." value={query} onChange={(e) => setQuery(e.target.value)} />
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

function Pre({ code }) {
  return <pre style={{ overflow: 'auto' }}><code>{code}</code></pre>;
}

function Sec({ id, num, title, children }) {
  return (
    <section id={id} style={{ marginBottom: '40px' }}>
      <div className="section-header"><span className="section-num">{num}</span><h2 className="section-title">{title}</h2></div>
      {children}
    </section>
  );
}

export default function InternalKopal() {
  return (
    <Shell>
      <header className="hero-banner">
        <div className="hero-title">KOPAL<br /><span>Developer Engineering Guide &amp; System Architecture</span></div>
        <p className="hero-desc">The world's first emotional AI literacy ecosystem for children - dual-interface Flutter platform, Go + Vertex AI backend, Firestore realtime control plane. Guided by humans. Powered by imagination.</p>
      </header>

      <Sec id="vision" num="01" title="Vision & Problem Statement">
        <p>Children meet AI today as solitary screen-time: chatbots, tablets, headsets - passive consumption with no emotional scaffolding. KOPAL flips this: <strong>AI as an empathetic, creative partner</strong> inside a shared physical room, always mediated by a trained human facilitator.</p>
        <div className="callout callout-info" style={{ margin: '14px 0 20px;' }}>
          <strong>Design constraints (non-negotiable):</strong> no personal devices for children · anonymous sessions, zero PII · facilitator owns the only control screen · every AI output must be explainable to a 6-year-old.
        </div>
      </Sec>

      <Sec id="dual-interface" num="02" title="Dual-Interface Architecture">
        <p>Two Flutter apps from one monorepo, synced through Firestore - never peer-to-peer, never local-only state:</p>
        <div className="grid-2">
          <div className="card"><h3>Facilitator Remote</h3><p><code>main_remote.dart</code> → tablet/Chrome. Command center: modules, phases, moods, actions, artwork capture, live preview mirror.</p></div>
          <div className="card"><h3>Projector Canvas</h3><p><code>main_display.dart</code> → macOS/desktop. Magic canvas: mesh gradients, particle orbs, Floof avatar, AI textures. Zero chrome, zero buttons.</p></div>
        </div>
        <div className="callout callout-warning" style={{ margin: '14px 0 20px;' }}>
          <strong>Golden rule:</strong> the projector never writes state - it only renders Firestore snapshots. All control flows Remote → Firestore → Display.
        </div>
      </Sec>

      <Sec id="journey" num="03" title="Session Journey & Pedagogy">
        <p>Five phases, ~45 minutes. The remote's phase stepper drives this exact order:</p>
        <div className="table-container">
          <table>
            <thead><tr><th>Phase</th><th>Beat</th><th>Engineering Hook</th></tr></thead>
            <tbody>
              <tr><td><strong>1. Arrive</strong></td><td>Wonder - ambient room settles the group</td><td>Mood preset <code>Calm</code>, slow orb pulse</td></tr>
              <tr><td><strong>2. Connect</strong></td><td>Check-in with Floof</td><td><code>projectorText</code> dialogue + subtitle sync</td></tr>
              <tr><td><strong>3. Imagine</strong></td><td>Storytelling, mood shifts live</td><td>Mood matrix transitions, tweened palettes</td></tr>
              <tr><td><strong>4. Create</strong></td><td>Drawings → AI textures</td><td>Texture pipeline, <code>isGeneratingTexture</code> overlay</td></tr>
              <tr><td><strong>5. Reflect</strong></td><td>Grounding, celebration</td><td>Session timer end, calm-down preset</td></tr>
            </tbody>
          </table>
        </div>
      </Sec>

      <Sec id="remote" num="04" title="Facilitator Remote (Flutter)">
        <p>Sleek dark mode (<code>#0B132B</code>, <code>#1C2541</code>), glassmorphism, emerald accents (<code>#4EE3AA</code>, <code>#009661</code>).</p>
        <div className="card">
          <p><strong>LMS module selector</strong> - browse <code>cat_stories</code> / <code>cat_activities</code>, syncs <code>activeModuleId</code>.</p>
          <p><strong>Phase stepper</strong> - countdown timers, facilitator prompt scripts, child guidance tips per beat.</p>
          <p><strong>Mood matrix</strong> - instant color-coded mood transitions on the projector.</p>
          <p><strong>Action triggers</strong> - Stomp / Whisper / Fly / Breathe drive character animation states.</p>
          <p><strong>Mini preview</strong> - scaled live mirror of the child view on the facilitator screen.</p>
        </div>
      </Sec>

      <Sec id="display" num="05" title="Projector Display (Flutter)">
        <div className="card">
          <p><strong>Mesh gradient engine</strong> - mood-palette interpolation with smooth curve tweens.</p>
          <p><strong>Particle orbs</strong> - <code>CustomPainter</code> multi-orb physics; velocity, spread and pulse follow mood intensity.</p>
          <p><strong>Audio/video</strong> - <code>audioplayers</code> ambience + <code>video_player</code> background loops, gesture-unlocked on web.</p>
          <p><strong>Texture layer</strong> - fade-in cached network images reacting to AI-generated assets.</p>
        </div>
      </Sec>

      <Sec id="website" num="06" title="Marketing App (React)">
        <div className="card"><p>React 18 + Vite (<code>Kopal_Website/</code>). Warm cream (<code>#FFFDF9</code>), playful type, organic SVG waves, interactive session timeline. Deploys independently of the session platform.</p></div>
      </Sec>

      <Sec id="architecture" num="07" title="Architecture Diagram">
        <div className="arch-diagram">
          <svg viewBox="0 0 720 340" style={{ width: '100%', height: 'auto', display: 'block' }} role="img" aria-label="KOPAL layered architecture">
            <rect x="60" y="15" width="600" height="90" rx="12" fill="none" stroke="#FFB611" strokeWidth="2" />
            <text x="80" y="42" fontSize="12" fontWeight="800" fill="currentColor">LAYER 1 · FRONTEND INTERFACES (Flutter)</text>
            <rect x="80" y="52" width="270" height="40" rx="8" fill="#FFB611" opacity="0.15" stroke="#FFB611" />
            <text x="94" y="77" fontSize="12" fontWeight="700" fill="currentColor">Facilitator Remote · tablet</text>
            <rect x="370" y="52" width="270" height="40" rx="8" fill="#FFB611" opacity="0.15" stroke="#FFB611" />
            <text x="384" y="77" fontSize="12" fontWeight="700" fill="currentColor">Projector Canvas · macOS</text>
            <line x1="215" y1="105" x2="215" y2="130" stroke="#FFB611" strokeWidth="2" />
            <line x1="505" y1="105" x2="505" y2="130" stroke="#FFB611" strokeWidth="2" />
            <rect x="60" y="130" width="600" height="70" rx="12" fill="none" stroke="#22d3ee" strokeWidth="2" />
            <text x="80" y="155" fontSize="12" fontWeight="800" fill="currentColor">LAYER 2 · REALTIME CONTROL PLANE (Firebase)</text>
            <text x="80" y="178" fontSize="12" fill="currentColor">venues/{'{venueId}'}/state/current · snapshot stream &lt;30ms</text>
            <line x1="360" y1="200" x2="360" y2="225" stroke="#22d3ee" strokeWidth="2" />
            <rect x="60" y="225" width="600" height="100" rx="12" fill="none" stroke="#4EE3AA" strokeWidth="2" />
            <text x="80" y="250" fontSize="12" fontWeight="800" fill="currentColor">LAYER 3 · COMPUTE &amp; AI (Go 1.22 :8081)</text>
            <rect x="80" y="260" width="170" height="40" rx="8" fill="#4EE3AA" opacity="0.15" stroke="#4EE3AA" />
            <text x="94" y="285" fontSize="12" fontWeight="700" fill="currentColor">Go Server · handlers</text>
            <rect x="265" y="260" width="170" height="40" rx="8" fill="#4EE3AA" opacity="0.15" stroke="#4EE3AA" />
            <text x="279" y="285" fontSize="12" fontWeight="700" fill="currentColor">Vertex AI Imagen</text>
            <rect x="450" y="260" width="170" height="40" rx="8" fill="#4EE3AA" opacity="0.15" stroke="#4EE3AA" />
            <text x="464" y="285" fontSize="12" fontWeight="700" fill="currentColor">GCS Texture Bucket</text>
          </svg>
        </div>
        <p>The texture round-trip:</p>
        <div className="card">
          {[
            ['1', 'Remote sets Phase / Mood / Action', 'Firestore document write'],
            ['2', 'Firestore snapshot (<30ms)', 'Display re-renders reactively'],
            ['3', 'Remote snaps & uploads photo', 'POST /api/texture-upload → Go :8081'],
            ['4', 'Go flags generation', 'isGeneratingTexture = true → overlay shows'],
            ['5', 'AI processes & stores', 'Vertex Imagen → GCS texture bucket'],
            ['6', 'Go publishes result', 'textureUrl set, flag cleared'],
            ['7', 'Display fade-in render', 'New environment cross-fades in'],
          ].map(([n, t, d]) => (
            <div className="flow-step" key={n}>
              <div className="flow-icon">{n}</div>
              <div className="flow-content"><strong>{t}.</strong> {d}</div>
            </div>
          ))}
        </div>
      </Sec>

      <Sec id="mood-palette" num="08" title="Mood Palette Contract">
        <p>Moods are the shared enum across remote, Firestore and display. Adding a mood means updating all three:</p>
        <div className="table-container">
          <table>
            <thead><tr><th>Mood</th><th>Projector Palette</th><th>Audio Pacing</th></tr></thead>
            <tbody>
              <tr><td>Calm</td><td>Deep blues, slow mesh drift</td><td>Slow ambient, low pulse</td></tr>
              <tr><td>Curious</td><td>Teal / violet shimmer</td><td>Playful arpeggios</td></tr>
              <tr><td>Happy</td><td>Warm golds, bright orbs</td><td>Upbeat, faster pulse</td></tr>
              <tr><td>Sad</td><td>Muted indigo, gentle fall</td><td>Soft, sparse tones</td></tr>
              <tr><td>Brave</td><td>Ember orange, rising orbs</td><td>Driving rhythm</td></tr>
              <tr><td>Excited</td><td>Magenta / gold bursts</td><td>Fast, bright layers</td></tr>
            </tbody>
          </table>
        </div>
      </Sec>

      <Sec id="state-protocol" num="09" title="State Protocol & Schema">
        <p>Single Firestore doc <code>venues/{'{venueId}'}/state/current</code> (default <code>default_venue</code>). Last-write-wins; remote is the only writer except Go's texture fields.</p>
        <Pre code={`interface KopalVenueState {
  phase: string;                // e.g. "Opening Circle", "Explore Forest"
  mood: string;                 // Calm | Curious | Happy | Sad | Brave | Excited
  action: string;               // Idle | Stomp | Whisper | Fly | Breathe
  projectorText: string;        // Subtitle / Floof dialogue
  textureUrl: string;           // GCS or local URL for background texture
  isGeneratingTexture: boolean; // "Synthesizing Environment" overlay
  ambientEffectsEnabled: boolean;
  sessionStarted: boolean;
  activeModuleId?: string;      // e.g. "floof_init", "magic_forest"
  updatedAt: Timestamp;
}`} />
      </Sec>

      <Sec id="api" num="10" title="HTTP API Endpoints">
        <div className="table-container">
          <table>
            <thead><tr><th>Method</th><th>Endpoint</th><th>Purpose</th></tr></thead>
            <tbody>
              <tr><td>POST</td><td>/api/texture-upload</td><td>Multipart artwork photo → triggers GenAI pipeline.</td></tr>
              <tr><td>GET</td><td>/api/health</td><td>Liveness probe for Cloud Run / local dev.</td></tr>
              <tr><td>WS</td><td>/ws</td><td>Optional socket channel alongside Firestore sync.</td></tr>
            </tbody>
          </table>
        </div>
      </Sec>

      <Sec id="modules" num="11" title="Module Catalog & Data Models">
        <div className="table-container">
          <table>
            <thead><tr><th>Module ID</th><th>Title</th><th>Focus</th></tr></thead>
            <tbody>
              <tr><td>floof_init</td><td>Floof's First Flight</td><td>Onboarding, first check-in</td></tr>
              <tr><td>magic_forest</td><td>Floof's Magic Forest</td><td>Storytelling + co-creation</td></tr>
              <tr><td>bodyland</td><td>Bodyland</td><td>Movement, body awareness</td></tr>
              <tr><td>big_feelings</td><td>Big Feelings</td><td>Emotional vocabulary, SEL</td></tr>
            </tbody>
          </table>
        </div>
        <p>Module contract (<code>data/modules/</code> + <code>models/</code>): every module ships phases[], each phase carries prompts[], actions[] and timing - the remote stepper renders directly from this, no hardcoded flows.</p>
      </Sec>

      <Sec id="security" num="12" title="Auth, Privacy & Safety Gates">
        <div className="callout callout-danger" style={{ margin: '14px 0 20px;' }}>
          <strong>Child-safety gates (CI-enforced):</strong> no child accounts or PII fields anywhere · artwork uploads scoped to session ID, purged post-session · production requires <code>DEV_MODE=false</code> + real GCP credentials, never committed.
        </div>
        <p>Venue isolation via <code>venueId</code> path scoping; Firestore rules deny cross-venue reads. Service-account JSON lives outside the repo - missing file must fail boot loudly, never silently.</p>
      </Sec>

      <Sec id="testing" num="13" title="Testing & Verification">
        <div className="table-container">
          <table>
            <thead><tr><th>Layer</th><th>What</th><th>Gate</th></tr></thead>
            <tbody>
              <tr><td>Go unit</td><td>Handlers, storage providers, DEV_MODE paths</td><td><code>go test ./...</code> green</td></tr>
              <tr><td>Flutter widget</td><td>Remote controls, mood matrix, stepper</td><td><code>flutter test</code> green</td></tr>
              <tr><td>Contract</td><td>Firestore schema shape, module JSON validity</td><td>Fixture-validated on PR</td></tr>
              <tr><td>E2E drill</td><td>Remote → Firestore → Display under 1s</td><td>Manual pre-release checklist</td></tr>
            </tbody>
          </table>
        </div>
      </Sec>

      <Sec id="quality" num="14" title="Code Quality & Security">
        <p>Same bar as Engineering Best Practices: <code>go vet</code> + <code>flutter analyze</code> clean, no hardcoded secrets, image-size budgets on uploads (DoS defense), dependency audits on PR.</p>
      </Sec>

      <Sec id="taxonomy" num="15" title="Codebase Taxonomy">
        <Pre code={`Kopal_MVP/backend-go/      main.go, Dockerfile, handlers/, services/
Kopal_MVP/flutter-shared-app/
  lib/main_remote.dart       Facilitator entry
  lib/main_display.dart      Projector entry
  lib/data/modules/          Curriculum content
  lib/models/                Data contracts
  lib/services/              Firestore sync client
  lib/views/                 Dashboards + projector layers
Kopal_Website/               React marketing app`} />
      </Sec>

      <Sec id="setup" num="16" title="5-Min Developer Setup">
        <Pre code={`# Terminal 1: Backend Brain (Go)
cd Kopal/Kopal_MVP/backend-go
DEV_MODE=true go run main.go        # -> http://localhost:8081

# Terminal 2: Facilitator (Chrome)
cd Kopal/Kopal_MVP/flutter-shared-app
flutter run -t lib/main_remote.dart -d chrome

# Terminal 3: Projector (macOS)
flutter run -t lib/main_display.dart -d macos`} />
      </Sec>

      <Sec id="recipe-module" num="17" title="Recipe: Add Curriculum Module">
        <div className="card">
          <p>1. Add module JSON under <code>lib/data/modules/</code> with id, title, phases[] (prompts, actions, timing).</p>
          <p>2. Register the id in the module catalog (this guide's §11 + LMS selector list).</p>
          <p>3. Add model fixtures + widget test rendering one phase.</p>
          <p>4. Run remote + display locally; walk all five journey beats before opening the PR.</p>
        </div>
      </Sec>

      <Sec id="recipe-mood" num="18" title="Recipe: Add a Mood">
        <div className="card">
          <p>1. Extend the mood enum in <code>models/</code> + Firestore schema comment.</p>
          <p>2. Add the palette tween + audio pacing in the display engine (§08 table row).</p>
          <p>3. Add the color-coded button to the remote mood matrix.</p>
          <p>4. Snapshot-test both engines with the new mood active.</p>
        </div>
      </Sec>

      <Sec id="deployment" num="19" title="Deployment & Runbook">
        <div className="card">
          <p><strong>Backend:</strong> containerized via <code>Dockerfile</code> → Cloud Run, port 8081, <code>DEV_MODE=false</code>, GCS bucket bound, service account mounted.</p>
          <p><strong>Display:</strong> macOS build on the venue machine, kiosk fullscreen, audio unlocked on first tap.</p>
          <p><strong>Remote:</strong> hosted Flutter web or venue tablet on the same network as Firestore project.</p>
          <p><strong>Rollback:</strong> previous Cloud Run revision one click away; display/remote are versioned builds - keep last known-good installers per venue.</p>
        </div>
      </Sec>

      <Sec id="troubleshooting" num="20" title="Troubleshooting">
        <div className="card"><h3>macOS Flutter code signing</h3><p>Keep <code>CODE_SIGN_IDENTITY = ""</code> for dev builds (see <code>startup.md</code>).</p></div>
        <div className="card"><h3>Audio autoplay lock</h3><p>Full-screen <code>GestureDetector</code> unlocks the browser audio context on tap.</p></div>
        <div className="card"><h3>Port 8080 collision</h3><p>Backend stays on <strong>8081</strong>; Flutter endpoints → <code>http://localhost:8081</code> (<code>http://10.0.2.2:8081</code> on Android emulators).</p></div>
      </Sec>
    </Shell>
  );
}
