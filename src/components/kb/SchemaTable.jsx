import React from 'react';

export function SchemaTable({ columns = ['Column', 'Type', 'Constraints', 'Description'], rows = [] }) {
  return (
    <div className="table-card">
      <table>
        <thead><tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>{r[0]}{r[4] === 'PK' ? <span className="key-badge pk-badge">PK</span> : null}{r[4] === 'FK' ? <span className="key-badge fk-badge">FK</span> : null}</td>
              <td style={{ fontFamily: 'ui-monospace,monospace', fontSize: 12 }}>{r[1]}</td>
              <td>{r[2]}</td>
              <td>{r[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default SchemaTable;
