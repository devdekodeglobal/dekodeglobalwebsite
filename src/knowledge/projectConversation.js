import { normalizeVisitorMessage } from './messageNormalization.js';
import {
  detectProjectFocus,
  isProjectRequest,
} from './projectResponseGenerator.js';

const CONTINUATION_PATTERN = /^(?:yes|yeah|yep|no|nope|sure|correct|exactly|also|and|but)\b|\b(?:my|our|their|they|them|it|its|user|users|visitor|visitors|customer|customers)\b/i;
const COMPANY_SWITCH_PATTERN = /\b(?:dekode|company|office|location|address|privacy|terms|price|pricing|case stud(?:y|ies)|portfolio|founder|founded|service(?:s)?)\b/i;

export function cleanProjectHistory(history, limit = 6) {
  if (!Array.isArray(history)) return [];
  return history
    .filter((entry) => entry && (entry.role === 'user' || entry.role === 'model'))
    .slice(-limit)
    .map((entry) => ({
      role: entry.role,
      text: String(entry.text || '').trim().slice(0, 600),
    }))
    .filter((entry) => entry.text);
}

export function hasProjectConversation(history) {
  return cleanProjectHistory(history).some((entry) => entry.role === 'user'
    && (isProjectRequest(entry.text) || Boolean(detectProjectFocus(entry.text))));
}

export function isProjectContinuation(question, history, intentKind = 'ambiguous') {
  if (!hasProjectConversation(history)) return false;
  if (intentKind === 'project') return true;
  if (['company', 'meeting', 'unsafe'].includes(intentKind)) return false;

  const normalized = normalizeVisitorMessage(question);
  if (!normalized || COMPANY_SWITCH_PATTERN.test(normalized)) return false;
  return normalized.length <= 280 && CONTINUATION_PATTERN.test(normalized);
}

export function buildProjectConversationQuery(question, history) {
  const priorUserTurns = cleanProjectHistory(history)
    .filter((entry) => entry.role === 'user')
    .slice(-4)
    .map((entry) => entry.text);
  const current = String(question || '').trim();
  const turns = [...priorUserTurns, current].filter(Boolean);
  if (turns.length <= 1) return current;
  return `Ongoing visitor project:\n${turns.map((turn) => `- ${turn}`).join('\n')}`;
}
