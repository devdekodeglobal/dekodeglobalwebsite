import React, { useState } from 'react';

/* Dependency-free ERD: draggable SVG nodes, theme-adaptive via kb.css variables. */
export default function InteractiveErd({ nodes = [], edges = [] }) {
  const [pos, setPos] = useState({});
  const [drag, setDrag] = useState(null);
  const W = 760, ROW_H = 240;
  const layout = nodes.map((n, i) => {
    const cols = 3;
    const x = 20 + (i % cols) * 250;
    const y = 20 + Math.floor(i / cols) * ROW_H;
    return { ...n, x: pos[n.id]?.x ?? x, y: pos[n.id]?.y ?? y };
  });
  const byId = Object.fromEntries(layout.map((n) => [n.id, n]));
  const onMove = (e) => {
    if (!drag) return;
    const svg = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX ?? e.touches?.[0]?.clientX) - svg.left) * (W / svg.width) - drag.dx;
    const y = ((e.clientY ?? e.touches?.[0]?.clientY) - svg.top) * (W / svg.width) - drag.dy;
    setPos((p) => ({ ...p, [drag.id]: { x: Math.max(0, x), y: Math.max(0, y) } }));
  };
  const H = Math.ceil(nodes.length / 3) * ROW_H + 40;
  return (
    <div className="erd-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} onMouseMove={onMove} onMouseUp={() => setDrag(null)} onMouseLeave={() => setDrag(null)}>
        {edges.map((ed, i) => {
          const a = byId[ed[0]], b = byId[ed[1]];
          if (!a || !b) return null;
          return <line key={i} x1={a.x + 105} y1={a.y + 18} x2={b.x + 105} y2={b.y + 18} stroke="#FFB611" strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray={ed[2] === 'opt' ? '5 4' : undefined} />;
        })}
        {layout.map((n) => (
          <g key={n.id} className="erd-node" transform={`translate(${n.x},${n.y})`}
            onMouseDown={(e) => { const r = e.currentTarget.getBoundingClientRect(); setDrag({ id: n.id, dx: (e.clientX - r.left) * (W / e.currentTarget.ownerSVGElement.getBoundingClientRect().width), dy: (e.clientY - r.top) * (W / e.currentTarget.ownerSVGElement.getBoundingClientRect().width) }); }}>
            <rect width="210" height={34 + n.fields.length * 17} rx="10" />
            <text x="12" y="21" fontWeight="800">{n.id}</text>
            {n.fields.map((f, j) => <text key={j} x="12" y={40 + j * 17} opacity="0.75">• {f}</text>)}
          </g>
        ))}
      </svg>
    </div>
  );
}
