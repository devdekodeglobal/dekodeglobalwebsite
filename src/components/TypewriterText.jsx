import React, { useState, useEffect } from 'react';

export function FormattedText({ text }) {
  const parts = [];
  const pattern = /\*\*([^*]+)\*\*/g;
  let cursor = 0;
  let match;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) parts.push(text.slice(cursor, match.index).replaceAll('**', ''));
    parts.push(<strong key={`${match.index}-${match[1]}`}>{match[1]}</strong>);
    cursor = match.index + match[0].length;
  }
  if (cursor < text.length) parts.push(text.slice(cursor).replaceAll('**', ''));
  return parts;
}

export default function TypewriterText({ text, delay = 20, onComplete }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const maxAnimationDuration = 1800;
  const charactersPerTick = Math.max(
    1,
    Math.ceil(text.length / Math.max(1, maxAnimationDuration / delay)),
  );

  useEffect(() => {
    // Reset if text changes
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        const nextIndex = Math.min(text.length, currentIndex + charactersPerTick);
        setDisplayedText(text.slice(0, nextIndex));
        setCurrentIndex(nextIndex);
      }, delay);
      
      return () => clearTimeout(timeout);
    } else if (onComplete && currentIndex === text.length) {
      // Fire onComplete when done
      onComplete();
    }
  }, [charactersPerTick, currentIndex, text, delay, onComplete]);

  return (
    <span>
      <FormattedText text={displayedText} />
      {currentIndex < text.length && (
        <span className="typewriter-cursor">|</span>
      )}
    </span>
  );
}
