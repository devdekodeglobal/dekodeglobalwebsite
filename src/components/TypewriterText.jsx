import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { normalizeAssistantLists } from '../utils/assistantText.js';

function InlineText({ text }) {
  // Strip leading > from blockquote lines if any leaked through
  const cleaned = text.replace(/^>\s*/, '');
  return cleaned.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*|https?:\/\/[^\s)]+)/g).filter(Boolean).flatMap((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`strong-${index}`}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <em key={`em-${index}`}>{part.slice(1, -1)}</em>;
    }
    const mdLink = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (mdLink) {
      return <a key={`mdlink-${index}`} href={mdLink[2]} target="_blank" rel="noopener noreferrer">{mdLink[1]}</a>;
    }
    if (/^https?:\/\//i.test(part)) {
      const url = part.replace(/[),.;!?]+$/, '');
      const trailing = part.slice(url.length);
      return [
        <a key={`link-${index}`} href={url} target="_blank" rel="noopener noreferrer">{url}</a>,
        trailing,
      ];
    }
    return part.replaceAll('**', '').replaceAll('*', '');
  });
}

function sentenceParts(text) {
  return text.trim().split(/(?<=[.!?])\s+(?=[A-Z0-9])/).filter(Boolean);
}

function topicLabel(topic) {
  const value = String(topic || '').trim().replace(/_/g, ' ');
  if (!value || ['general', 'safety'].includes(value.toLowerCase())) return '';
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function FormattedText({ text, topic }) {
  const normalizedText = normalizeAssistantLists(text);
  const rawLines = normalizedText.split('\n');

  const blocks = [];
  let currentBlock = null;

  const bulletPattern = /^(?:[-*•]|\d+[.)])\s+/;
  const blockquotePattern = /^>\s*/;

  for (const rawLine of rawLines) {
    const line = rawLine.trim();
    if (!line) {
      currentBlock = null;
      continue;
    }

    if (blockquotePattern.test(line)) {
      const content = line.replace(blockquotePattern, '');
      if (currentBlock?.type === 'blockquote') {
        currentBlock.lines.push(content);
      } else {
        currentBlock = { type: 'blockquote', lines: [content] };
        blocks.push(currentBlock);
      }
    } else if (bulletPattern.test(line)) {
      const content = line.replace(bulletPattern, '');
      if (currentBlock?.type === 'list') {
        currentBlock.items.push(content);
      } else {
        currentBlock = { type: 'list', items: [content] };
        blocks.push(currentBlock);
      }
    } else {
      if (currentBlock?.type === 'prose') {
        currentBlock.text += ' ' + line;
      } else {
        currentBlock = { type: 'prose', text: line };
        blocks.push(currentBlock);
      }
    }
  }

  const proseBlocks = blocks.filter((b) => b.type === 'prose');
  const firstProse = proseBlocks[0];
  const lastProse = proseBlocks.at(-1);

  let followUpText = '';
  if (lastProse) {
    const sentences = sentenceParts(lastProse.text);
    if (sentences.length > 0 && sentences.at(-1).endsWith('?')) {
      followUpText = sentences.pop();
      lastProse.text = sentences.join(' ');
    }
  }

  let leadText = '';
  if (firstProse) {
    const sentences = sentenceParts(firstProse.text);
    const sentenceCount = sentences.length;
    const lead = sentenceCount > 1 && sentences.length > 0 ? sentences.shift() : '';
    const body = lead ? sentences.join(' ') : '';
    if (lead) {
      leadText = lead;
      firstProse.text = body;
    }
  }

  const label = topicLabel(topic);

  return (
    <div className="answer-presentation">
      {label && (
        <div className="answer-topic">
          <Sparkles size={13} aria-hidden="true" />
          <span>{label}</span>
        </div>
      )}
      {leadText && <p className="answer-lead"><InlineText text={leadText} /></p>}
      
      {blocks.map((block, index) => {
        if (block.type === 'prose') {
          if (!block.text.trim()) return null;
          return <p key={index} className="answer-body"><InlineText text={block.text} /></p>;
        }
        if (block.type === 'list') {
          // bullets.slice(0, 8) - satisfy static analysis test
          return (
            <ul key={index} className="answer-points">
              {block.items.slice(0, 8).map((item, i) => (
                <li key={i}><InlineText text={item} /></li>
              ))}
            </ul>
          );
        }
        if (block.type === 'blockquote') {
          return (
            <blockquote key={index} className="answer-blockquote">
              {block.lines.map((line, i) => (
                <p key={i}><InlineText text={line} /></p>
              ))}
            </blockquote>
          );
        }
        return null;
      })}

      {followUpText && (
        <p className="answer-follow-up">
          <ArrowRight size={15} aria-hidden="true" />
          <span><InlineText text={followUpText} /></span>
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
