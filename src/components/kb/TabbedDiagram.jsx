import React, { useState } from 'react';

export default function TabbedDiagram({ tabs = [] }) {
  const [idx, setIdx] = useState(0);
  if (!tabs.length) return null;
  return (
    <div className="tabbed-diagram">
      <div className="tabbed-bar">
        {tabs.map((t, i) => <button key={t.label} className={i === idx ? 'active' : ''} onClick={() => setIdx(i)}>{t.label}</button>)}
      </div>
      <div className="tabbed-body">{tabs[idx]?.content}</div>
    </div>
  );
}
