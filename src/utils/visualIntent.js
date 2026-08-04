const VISUAL_INTENT_PATTERNS = [
  ['calendar', /\b(calendar|meeting|schedule|booking|book a call|availability|available time|date|time slot|discovery call)\b/i],
  ['ecommerce', /\b(e-?commerce|shop|store|cart|checkout|retail|marketplace|payment)\b/i],
  ['mobile', /\b(mobile|phone|ios|android|tablet|app store|play store)\b/i],
  ['cloud', /\b(cloud|server|database|infrastructure|api|integration|security|authentication|hosting|aws|azure|gcp)\b/i],
  ['ai', /\b(ai|artificial intelligence|agent|automation|model|llm|chatbot|copilot|predictive|analytics|machine learning)\b/i],
  ['web', /\b(web|website|browser|desktop|portal|dashboard|saas)\b/i],
];

export function resolveVisualMode(projectType, messages = []) {
  const latestUserMessages = messages
    .filter((message) => message.sender === 'user')
    .slice(-3)
    .reverse();

  for (const message of latestUserMessages) {
    const text = String(message.text || '');
    const match = VISUAL_INTENT_PATTERNS.find(([, pattern]) => pattern.test(text));
    if (match) return match[0];
  }

  const projectText = String(projectType || '');
  return VISUAL_INTENT_PATTERNS.find(([, pattern]) => pattern.test(projectText))?.[0] || 'web';
}
