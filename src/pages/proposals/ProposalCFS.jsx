import React, { useState } from 'react';
import './ProposalCFS.css';

const ProposalCFS = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');

  const [view, setView] = useState('manual');
  const [activePath, setActivePath] = useState('all');

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === 'OCTX2026TV') {
      setIsAuthenticated(true);
    } else {
      setError('Incorrect password');
    }
  };

  const highlightPath = (pathClass) => {
    setActivePath(pathClass);
  };

  const getPathClass = (classes) => {
    const classList = classes.split(' ');
    if (activePath === 'all') return classes;
    return classes + (classList.includes(activePath) ? '' : ' dimmed');
  };

  if (!isAuthenticated) {
    return (
      <div className="workflow-container" style={{paddingTop: '120px', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '400px', width: '100%'}}>
          <h2 style={{marginTop: '0', color: '#0b1d3a', marginBottom: '8px'}}>Protected Proposal</h2>
          <p style={{color: '#475569', fontSize: '14px', marginBottom: '24px'}}>Please enter the access code to view this document.</p>
          
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              value={passwordInput}
              onChange={(e) => { setPasswordInput(e.target.value); setError(''); }}
              placeholder="Enter password"
              style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '16px', boxSizing: 'border-box', fontSize: '16px'}}
            />
            {error && <p style={{color: '#ef4444', fontSize: '13px', margin: '0 0 16px 0', textAlign: 'left'}}>{error}</p>}
            <button 
              type="submit"
              style={{width: '100%', padding: '12px', background: '#053364', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '16px'}}
            >
              Access Proposal
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="workflow-container" style={{paddingTop: '120px'}}>
      
      {/* Unified Segmented Control Toggle */}
      <div className="segmented-control">
        <button 
          className={`segmented-btn ${view === 'manual' ? 'active' : ''}`} 
          onClick={() => setView('manual')}
        >
          Current Process: Manual
        </button>
        <button 
          className={`segmented-btn ${view === 'automated' ? 'active' : ''}`} 
          onClick={() => setView('automated')}
        >
          Proposed Process: OptiFlow
        </button>
      </div>
      
      {/* AUTOMATED VIEW */}
      {view === 'automated' && (
        <div id="automated-view">
          
          {/* Header */}
          <div className="header-section" style={{position: 'relative'}}>
            <h1>OptiFlow</h1>
            <p style={{fontSize: '18px', color: '#475569', fontWeight: '500'}}>Transitioning from manual spreadsheet analysis to an automated, intelligent allocation workflow.</p>
            
            <div style={{textAlign: 'left', backgroundColor: '#ecfdf5', borderLeft: '4px solid #10b981', padding: '24px', borderRadius: '8px', marginTop: '24px'}}>
              <h2 style={{color: '#047857', marginTop: '0', marginBottom: '12px', fontSize: '22px'}}>The Automated Solution</h2>
              <p style={{fontSize: '16px', color: '#334155', marginBottom: '16px', lineHeight: '1.6'}}>
                We are deploying a deterministic <strong>Logic Engine</strong> paired with a <strong>Human-in-the-Loop (HITL) Dashboard</strong>. This eliminates manual Excel math and automates 95% of standard replenishment.
              </p>
              <p style={{fontSize: '16px', color: '#334155', marginBottom: '16px', lineHeight: '1.6'}}>
                The user simply uploads the raw store and warehouse CSV data. The system automatically calculates Planogram deficits and executes allocations.
              </p>
              <div style={{backgroundColor: '#d1fae5', padding: '16px', borderRadius: '6px', border: '1px solid #a7f3d0'}}>
                <p style={{margin: '0', fontSize: '15px', color: '#065f46', fontWeight: '500', lineHeight: '1.6'}}>
                  <strong style={{color: '#047857'}}>Exception Handling:</strong> If the exact frame is out of stock, the system automatically finds the closest matching substitute (using heuristics and other metrics). The human manager only has to click "Approve" on these rare exceptions, reducing a 5.5-hour manual process to seconds.
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Flowchart */}
          <div className="flowchart-section">
            <h2 style={{marginTop: '0', marginBottom: '8px'}}>Automated Decision Workflow</h2>
            <p style={{color: 'var(--text-secondary)', marginBottom: '24px'}}>End-to-end logic for how the system processes store schedules, calculates deficits, and routes exceptions.</p>

            {/* Dynamic Filters */}
            <div className="filter-btn-group">
              <button className={`filter-btn ${activePath === 'all' ? 'active' : ''}`} onClick={() => highlightPath('all')}>
                Show Full Workflow
              </button>
              <button className={`filter-btn ${activePath === 'path-skip' ? 'active' : ''}`} onClick={() => highlightPath('path-skip')}>
                Path 1: Stock Adequate
              </button>
              <button className={`filter-btn ${activePath === 'path-match' ? 'active' : ''}`} onClick={() => highlightPath('path-match')}>
                Path 2: Auto-Allocate
              </button>
              <button className={`filter-btn ${activePath === 'path-exception' ? 'active' : ''}`} onClick={() => highlightPath('path-exception')}>
                Path 3: Substitute Match
              </button>
              <button className={`filter-btn ${activePath === 'path-stockout' ? 'active' : ''}`} onClick={() => highlightPath('path-stockout')}>
                Path 4: Total Stockout
              </button>
            </div>

            <div className="svg-container">
              <svg width="100%" height="1200" viewBox="150 0 700 1200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="primaryGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#053364"/>
                    <stop offset="100%" stopColor="#053364"/>
                  </linearGradient>
                  <linearGradient id="secondaryGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FEB611"/>
                    <stop offset="100%" stopColor="#FEB611"/>
                  </linearGradient>
                  <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
                  </marker>
                </defs>

                {/* COMMON PATH (1-6) */}
                <g className={getPathClass("flow-element path-skip path-match path-exception path-stockout")}>
                  {/* 1. Start */}
                  <rect x="350" y="30" width="200" height="55" rx="27.5" fill="#053364" />
                  <text x="450" y="55" className="svg-white-text" textAnchor="middle">Start</text>
                  <text x="450" y="72" fill="#94a3b8" fontSize="11" textAnchor="middle">(Allocation Day)</text>
                  <path d="M450 85 V120" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)"/>

                  {/* 2. Upload Planogram */}
                  <rect x="300" y="120" width="300" height="45" rx="8" fill="var(--bg-card)" stroke="#cbd5e1" strokeWidth="2"/>
                  <text x="450" y="146" className="svg-node-text" textAnchor="middle">Upload/Retrieve Planogram(s)</text>
                  <path d="M450 165 V200" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)"/>

                  {/* 3. Upload Sales */}
                  <rect x="300" y="200" width="300" height="45" rx="8" fill="var(--bg-card)" stroke="#cbd5e1" strokeWidth="2"/>
                  <text x="450" y="226" className="svg-node-text" textAnchor="middle">Upload/Retrieve Last 7 Day Sales</text>
                  <path d="M450 245 V280" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)"/>

                  {/* 4. Upload Current Stock */}
                  <rect x="300" y="280" width="300" height="45" rx="8" fill="var(--bg-card)" stroke="#cbd5e1" strokeWidth="2"/>
                  <text x="450" y="306" className="svg-node-text" textAnchor="middle">Upload/Retrieve Current Stock(s)</text>
                  <path d="M450 325 V360" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)"/>

                  {/* 5. Upload WH Stock */}
                  <rect x="300" y="360" width="300" height="45" rx="8" fill="var(--bg-card)" stroke="#cbd5e1" strokeWidth="2"/>
                  <text x="450" y="386" className="svg-node-text" textAnchor="middle">Upload/Retrieve Warehouse Stock</text>
                  <path d="M450 405 V440" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)"/>

                  {/* OptiFlow Engine */}
                  <rect x="300" y="440" width="300" height="50" rx="8" fill="#FEB611" stroke="#FEB611" strokeWidth="2"/>
                  <text x="450" y="470" className="svg-node-text" textAnchor="middle" fill="#ffffff">OptiFlow Engine Processing</text>
                  <path d="M450 490 V520" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)"/>

                  {/* 6. Generate Report */}
                  <rect x="250" y="520" width="400" height="50" rx="8" fill="url(#primaryGrad)"/>
                  <text x="450" y="550" className="svg-white-text" textAnchor="middle">Generate Allocation/Replenishment Report</text>
                  <path d="M450 570 V610" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)"/>

                  {/* 7. Diamond: Deficit Exists? */}
                  <polygon points="450,610 560,650 450,690 340,650" fill="var(--bg-card)" stroke="#FEB611" strokeWidth="2"/>
                  <text x="450" y="654" className="svg-node-text" textAnchor="middle">Deficit Exists?</text>
                </g>

                {/* PATH 1: STOCK ADEQUATE (NO) */}
                <g className={getPathClass("flow-element path-skip")}>
                  <path d="M360 650 H200 V1145 H350" stroke="#64748b" strokeWidth="2" fill="none" markerEnd="url(#arrow)"/>
                  <rect x="250" y="639" width="40" height="22" rx="11" fill="#ef4444" />
                  <text x="270" y="654" fill="white" fontSize="11" fontWeight="600" textAnchor="middle">NO</text>
                </g>

                {/* COMMON PATH (Deficit YES) */}
                <g className={getPathClass("flow-element path-match path-exception path-stockout")}>
                  <path d="M450 690 V730" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)"/>
                  <rect x="430" y="699" width="40" height="22" rx="11" fill="#10b981" />
                  <text x="450" y="714" fill="white" fontSize="11" fontWeight="600" textAnchor="middle">YES</text>

                  {/* 8. Diamond: Exact SKU Found? */}
                  <polygon points="450,730 560,770 450,810 340,770" fill="var(--bg-card)" stroke="#FEB611" strokeWidth="2"/>
                  <text x="450" y="774" className="svg-node-text" textAnchor="middle">Exact SKU Found?</text>
                </g>

                {/* PATH 2: AUTO-ALLOCATE (Exact SKU Found YES) */}
                <g className={getPathClass("flow-element path-match")}>
                  <path d="M560 770 H700 V955" stroke="#64748b" strokeWidth="2" fill="none" markerEnd="url(#arrow)"/>
                  <rect x="600" y="759" width="40" height="22" rx="11" fill="#10b981" />
                  <text x="620" y="774" fill="white" fontSize="11" fontWeight="600" textAnchor="middle">YES</text>
                </g>

                {/* COMMON PATH (Exact SKU Found NO) */}
                <g className={getPathClass("flow-element path-exception path-stockout")}>
                  <path d="M450 810 V850" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)"/>
                  <rect x="430" y="819" width="40" height="22" rx="11" fill="#ef4444" />
                  <text x="450" y="834" fill="white" fontSize="11" fontWeight="600" textAnchor="middle">NO</text>

                  {/* 9. Process: Find Substitute */}
                  <rect x="300" y="850" width="300" height="50" rx="8" fill="var(--bg-card)" stroke="#cbd5e1" strokeWidth="2"/>
                  <text x="450" y="873" className="svg-node-text" textAnchor="middle">Find Substitute</text>
                  <text x="450" y="890" fill="#64748b" fontSize="10" textAnchor="middle">Score: Heuristics &amp; Other Metrics</text>
                  <path d="M450 900 V940" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)"/>

                  {/* 10. Diamond: Perfect Substitute? */}
                  <polygon points="450,940 560,980 450,1020 340,980" fill="var(--bg-card)" stroke="#FEB611" strokeWidth="2"/>
                  <text x="450" y="984" className="svg-node-text" textAnchor="middle">Perfect Substitute?</text>
                </g>

                {/* PATH 3: SUBSTITUTE MATCH (Perfect Substitute YES) */}
                <g className={getPathClass("flow-element path-exception")}>
                  <path d="M560 980 H600" stroke="#64748b" strokeWidth="2" fill="none" markerEnd="url(#arrow)"/>
                  <rect x="560" y="969" width="40" height="22" rx="11" fill="#10b981" />
                  <text x="580" y="984" fill="white" fontSize="11" fontWeight="600" textAnchor="middle">YES</text>
                </g>

                {/* PATHWAY TO ALLOCATION & DISPATCH (SHARED BY 2 & 3) */}
                <g className={getPathClass("flow-element path-match path-exception")}>
                  {/* 11. Allocate SKU */}
                  <rect x="600" y="955" width="200" height="50" rx="8" fill="url(#primaryGrad)"/>
                  <text x="700" y="985" className="svg-white-text" textAnchor="middle">Allocate SKU</text>
                  <path d="M700 1005 V1060" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)"/>

                  {/* 12. Dispatch Order */}
                  <rect x="580" y="1060" width="240" height="50" rx="8" fill="var(--bg-card)" stroke="#10b981" strokeWidth="2"/>
                  <text x="700" y="1090" className="svg-node-text" textAnchor="middle">Dispatch Order Generated</text>
                  <path d="M700 1110 V1145 H550" stroke="#64748b" strokeWidth="2" fill="none" markerEnd="url(#arrow)"/>
                </g>

                {/* PATH 4: STOCKOUT (Perfect Substitute NO) */}
                <g className={getPathClass("flow-element path-stockout")}>
                  <path d="M450 1020 V1060" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)"/>
                  <rect x="430" y="1029" width="40" height="22" rx="11" fill="#ef4444" />
                  <text x="450" y="1044" fill="white" fontSize="11" fontWeight="600" textAnchor="middle">NO</text>
                  <rect x="330" y="1060" width="240" height="45" rx="8" fill="var(--bg-card)" stroke="#ef4444" strokeWidth="2"/>
                  <text x="450" y="1087" className="svg-node-text" textAnchor="middle">Report Generated</text>
                  <path d="M450 1105 V1120" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)"/>
                </g>

                {/* COMMON END NODE */}
                <g className={getPathClass("flow-element path-skip path-match path-exception path-stockout")}>
                  {/* 13. END */}
                  <rect x="350" y="1120" width="200" height="50" rx="25" fill="#053364" />
                  <text x="450" y="1150" className="svg-white-text" textAnchor="middle">END</text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* MANUAL VIEW */}
      {view === 'manual' && (
        <div id="manual-view">
          <div className="header-section" style={{position: 'relative'}}>
            <h1>Legacy Process: Manual Distribution</h1>
            
            <div style={{textAlign: 'left', backgroundColor: '#fff8f1', borderLeft: '4px solid #f97316', padding: '24px', borderRadius: '8px', marginTop: '24px'}}>
              <h2 style={{color: '#ea580c', marginTop: '0', marginBottom: '12px', fontSize: '22px'}}>The Legacy Problem</h2>
              <p style={{fontSize: '16px', color: '#334155', marginBottom: '16px', lineHeight: '1.6'}}>
                Currently, inventory replenishment is driven entirely by manual Excel spreadsheets. Merchandisers must export raw data, run complex VLOOKUPs to compare store stock against Planograms, and manually guess which substitute frame to send when the central warehouse has a stockout.
              </p>
              <p style={{fontSize: '16px', color: '#334155', marginBottom: '24px', lineHeight: '1.6', fontWeight: '500'}}>
                This manual process introduces significant operational bottlenecks and subjective decision-making into the supply chain.
              </p>
              
              <h3 style={{color: '#0f172a', marginBottom: '12px', fontSize: '18px'}}>Network Manual Overhead</h3>
              <ul style={{fontSize: '15px', color: '#475569', lineHeight: '1.8', marginBottom: '20px', listStyleType: 'none', paddingLeft: '0'}}>
                <li>• <strong>Grade A Stores (Weekly):</strong> 22 stores = 88 runs/mo</li>
                <li>• <strong>Grade B Stores (Fortnightly):</strong> 30 stores = 60 runs/mo</li>
                <li>• <strong>Grade C Stores (Monthly):</strong> 43 stores = 43 runs/mo</li>
              </ul>
              <div style={{backgroundColor: '#ffedd5', padding: '16px', borderRadius: '6px', border: '1px solid #fdba74'}}>
                <p style={{margin: '0', fontSize: '16px', color: '#9a3412', fontWeight: '600'}}>
                  191 total manual events per month &times; 5.5 hours per store run = <span style={{fontSize: '20px', color: '#dc2626'}}>12,600+ Hours</span> Wasted Annually
                </p>
                <p style={{margin: '8px 0 0 0', fontSize: '14px', color: '#c2410c'}}>
                  <em>(Over ₹16,00,000+ wasted per year assuming standard minimum skilled analyst wages in Delhi)</em>
                </p>
              </div>
            </div>
          </div>
          <div className="flowchart-section">
            
            <div className="svg-container">
              <svg width="100%" height="1100" viewBox="250 0 780 1100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="painGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f97316"/>
                    <stop offset="100%" stopColor="#ea580c"/>
                  </linearGradient>
                  <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#94a3b8" />
                  </marker>
                  <marker id="arrow-dash" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" />
                  </marker>
                </defs>

                {/* 1. Start */}
                <rect x="300" y="30" width="300" height="60" rx="30" fill="#053364" />
                <text x="450" y="55" className="svg-white-text" textAnchor="middle">Start</text>
                <text x="450" y="75" fill="#94a3b8" fontSize="11" textAnchor="middle">(Distribution Day) Allocation</text>

                <path d="M450 90 V140" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)"/>

                {/* 2. Get Planned Stock */}
                <rect x="300" y="140" width="300" height="50" rx="8" fill="var(--bg-card)" stroke="#cbd5e1" strokeWidth="2"/>
                <text x="450" y="170" className="svg-node-text" textAnchor="middle">Get Planned Stock for Store</text>

                <path d="M450 190 V240" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)"/>

                {/* 3. Get Sales */}
                <rect x="300" y="240" width="300" height="50" rx="8" fill="var(--bg-card)" stroke="#cbd5e1" strokeWidth="2"/>
                <text x="450" y="270" className="svg-node-text" textAnchor="middle">Get Last 7 Day Sales</text>

                <path d="M450 290 V340" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)"/>

                {/* 4. Get Current Stock */}
                <rect x="300" y="340" width="300" height="50" rx="8" fill="var(--bg-card)" stroke="#cbd5e1" strokeWidth="2"/>
                <text x="450" y="370" className="svg-node-text" textAnchor="middle">Get Current Stock for Store</text>

                <path d="M450 390 V440" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)"/>

                {/* 5. Get WH Stock */}
                <rect x="300" y="440" width="300" height="50" rx="8" fill="var(--bg-card)" stroke="#cbd5e1" strokeWidth="2"/>
                <text x="450" y="470" className="svg-node-text" textAnchor="middle">Get Warehouse Stock</text>

                <path d="M450 490 V540" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)"/>

                {/* 6. Logistics Manager / Analyst manually... */}
                <rect x="280" y="540" width="340" height="60" rx="8" fill="#FEB611" stroke="#FEB611" strokeWidth="2"/>
                <text x="450" y="565" fill="#053364" fontWeight="700" fontSize="14" textAnchor="middle">Logistics Manager / Analyst</text>
                <text x="450" y="582" fill="#053364" fontWeight="500" fontSize="12" textAnchor="middle">Manually cross-references all inputs</text>

                <path d="M450 600 V650" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)"/>

                {/* 7. Dispatch to Store */}
                <rect x="320" y="650" width="260" height="50" rx="8" fill="#053364" stroke="#053364" strokeWidth="2"/>
                <text x="450" y="680" className="svg-white-text" textAnchor="middle">Dispatch to Store</text>

                <path d="M450 700 V750" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)"/>

                {/* 8. Stock Reconciled */}
                <rect x="300" y="750" width="300" height="60" rx="8" fill="var(--bg-card)" stroke="#cbd5e1" strokeWidth="2"/>
                <text x="450" y="775" className="svg-node-text" textAnchor="middle">Stock Reconciled</text>
                <text x="450" y="792" className="svg-sub-text" textAnchor="middle">(Store + Warehouse)</text>

                <path d="M450 810 V860" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)"/>

                {/* 9. Diamond: More Grade A Stores? */}
                <polygon points="450,860 580,900 450,940 320,900" fill="var(--bg-card)" stroke="#FEB611" strokeWidth="2"/>
                <text x="450" y="904" className="svg-node-text" textAnchor="middle">More Grade A Stores?</text>

                {/* YES Path (Next Store Loop) */}
                <path d="M580 900 H980 V60 H600" stroke="#FEB611" strokeWidth="2" strokeDasharray="8 8" fill="none" markerEnd="url(#arrow)"/>
                <rect x="580" y="889" width="40" height="22" rx="11" fill="#10b981" />
                <text x="600" y="904" fill="white" fontSize="11" fontWeight="600" textAnchor="middle">YES</text>
                <text x="970" y="480" fill="#FEB611" fontSize="12" fontWeight="700" textAnchor="middle" transform="rotate(-90 970 480)">NEXT STORE</text>

                {/* NO Path */}
                <path d="M450 940 V990" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)"/>
                <rect x="430" y="949" width="40" height="22" rx="11" fill="#ef4444" />
                <text x="450" y="964" fill="white" fontSize="11" fontWeight="600" textAnchor="middle">NO</text>

                {/* 10. END */}
                <rect x="350" y="990" width="200" height="50" rx="25" fill="#053364" />
                <text x="450" y="1020" className="svg-white-text" textAnchor="middle">END</text>
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalCFS;
