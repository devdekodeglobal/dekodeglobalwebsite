import React from 'react';

export default function Callout({ type = 'info', children }) {
  return <div className={`callout ${type}`}>{children}</div>;
}
