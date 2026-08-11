import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { normalizeAssistantLists } from '../utils/assistantText.js';

function InlineText({ text }) {
  return text.split(/(\*\*[^*]+\*\*|https?:\/\/[^\s]+)/g).filter(Boolean).flatMap((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`strong-${index}`}>{part.slice(2, -2)}</strong>;
    }
    if (/^https?:\/\//i.test(part)) {
      const url = part.replace(/[),.;!?]+$/, '');
      const trailing = part.slice(url.length);
      return [
        <a key={`link-${index}`} href={url} target="_blank" rel="noopener noreferrer">{url}</a>,
        trailing,
      ];
    }
    return part.replaceAll('**', '');
  });
}

function sentenceParts(text) {
  return text.trim().split(/(?<=[.!?])\s+(?=[A-Z0-9])/).filter(Boolean);
}

function topicLabel(topic) {
  const value = String(topic || '').trim();
  if (!value || ['general', 'safety'].includes(value.toLowerCase())) return '';
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function FormattedText({ text, topic }) {
  const normalizedText = normalizeAssistantLists(text)
    .replace(/\s+([*-])\s+(?=\*\*[^*]+\*\*\s*:)/g, '\n$1 ');
  const bulletPattern = /^(?:[-*•]|\d+[.)])\s+/;
  const lines = normalizedText.split('\n').map((line) => line.trim()).filter(Boolean);
  const bullets = lines
    .filter((line) => bulletPattern.test(line))
    .map((line) => line.replace(bulletPattern, ''));
  const prose = lines.filter((line) => !bulletPattern.test(line)).join(' ');
  const sentences = sentenceParts(prose);
  const sentenceCount = sentences.length;
  const followUp = sentences.length > 1 && sentences.at(-1).endsWith('?')
    ? sentences.pop()
    : '';
  const lead = sentenceCount > 1 && sentences.length > 0 ? sentences.shift() : '';
  const body = lead ? sentences.join(' ') : '';
  const label = topicLabel(topic);

  return (
    <div className="answer-presentation">
      {label && (
        <div className="answer-topic">
          <Sparkles size={13} aria-hidden="true" />
          <span>{label}</span>
        </div>
      )}
      {lead && <p className="answer-lead"><InlineText text={lead} /></p>}
      {body && <p className="answer-body"><InlineText text={body} /></p>}
      {!lead && prose && <p className="answer-body"><InlineText text={prose} /></p>}
      {bullets.length > 0 && (
        <ul className="answer-points">
          {bullets.slice(0, 8).map((bullet, index) => (
            <li key={`${index}-${bullet}`}><InlineText text={bullet} /></li>
          ))}
        </ul>
      )}
      {followUp && (
        <p className="answer-follow-up">
          <ArrowRight size={15} aria-hidden="true" />
          <InlineText text={followUp} />
        </p>
      )}
    </div>
  );
}

export default function TypewriterText({ text, topic, delay = 20, onComplete }) {
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
    <div className="typewriter-answer">
      <FormattedText text={displayedText} topic={topic} />
      {currentIndex < text.length && (
        <span className="typewriter-cursor">|</span>
      )}
    </div>
  );
}
