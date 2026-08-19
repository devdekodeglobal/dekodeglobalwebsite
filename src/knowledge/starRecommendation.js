export const STAR_TRUST_SUGGESTION = Object.freeze({
  label: 'Why clients trust DEKODE',
  prompt: "What are DEKODE's STAR principles?",
  kind: 'discovery',
  intent: 'company_info',
  action: 'show_company_panel',
});

const normalize = (value) => String(value || '')
  .toLowerCase()
  .replace(/[^a-z0-9\s']/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const EXPLICIT_STAR = /\bstar(?:\s+(?:principles?|standard|values?))?\b/;

const STRONG_TRUST_PATTERNS = [
  /\bwhy (?:should|would|can) (?:i|we) (?:choose|hire|trust|work with) (?:you|dekode)\b/,
  /\bwhy (?:choose|trust|hire|work with) dekode\b/,
  /\b(?:can|should) (?:i|we) trust (?:you|dekode)\b/,
  /\bwhat (?:makes|sets) dekode (?:different|apart|better|unique)\b/,
  /\bhow (?:is|are) dekode (?:different|better)\b/,
  /\bwhat (?:makes|sets) you (?:different|apart|better|unique)\b/,
];

const COMPANY_SUBJECT = /\b(?:dekode|you|your team|your company|your agency|your delivery|delivery partner|technology partner)\b/;
const TRUST_SIGNAL = /\b(?:trust|trustworthy|different|difference|stand out|choose|reliable|reliability|transparent|transparency|accountable|accountability|dependable|confidence|communicat(?:e|ion)|keep (?:us|me) informed|after launch|commitments?)\b/;
const PRODUCT_ATTRIBUTE = /\b(?:build|create|develop|design|make)\b.{0,36}\b(?:app|website|platform|system|software|product|feature|dashboard|workflow)\b/;

const isStarSuggestion = (suggestion) => {
  const value = normalize(`${suggestion?.label || ''} ${suggestion?.prompt || ''}`);
  return EXPLICIT_STAR.test(value) || value.includes('why clients trust dekode');
};

export function isStarTrustIntent(message) {
  const query = normalize(message);
  if (!query || EXPLICIT_STAR.test(query)) return false;
  if (STRONG_TRUST_PATTERNS.some((pattern) => pattern.test(query))) return true;
  if (PRODUCT_ATTRIBUTE.test(query) && !/\b(?:trust|choose|different|stand out)\b/.test(query)) return false;
  return COMPANY_SUBJECT.test(query) && TRUST_SIGNAL.test(query);
}

export function routeStarTrustSuggestion(suggestions, message, usedSuggestionLabels = []) {
  const list = Array.isArray(suggestions) ? suggestions : [];
  const query = normalize(message);

  if (EXPLICIT_STAR.test(query)) return list.filter((suggestion) => !isStarSuggestion(suggestion));
  if (!isStarTrustIntent(query)) return list;

  const starWasShown = usedSuggestionLabels
    .map(normalize)
    .some((label) => EXPLICIT_STAR.test(label) || label.includes('why clients trust dekode'));
  if (starWasShown) return list.filter((suggestion) => !isStarSuggestion(suggestion));

  const remaining = list.filter((suggestion) => !isStarSuggestion(suggestion) && suggestion?.kind !== 'discovery');
  return [STAR_TRUST_SUGGESTION, ...remaining].slice(0, 4);
}
