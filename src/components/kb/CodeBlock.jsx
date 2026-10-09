import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CodeBlock({ language = 'code', code = '' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };
  return (
    <div className="codeblock">
      <div className="codeblock-header"><span>{language}</span>
        <button onClick={copy}>{copied ? <Check size={12} /> : <Copy size={12} />}{copied ? ' Copied' : ' Copy'}</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
}
