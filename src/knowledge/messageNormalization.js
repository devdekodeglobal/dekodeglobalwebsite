const REPLACEMENTS = [
  [/\bcalanders?\b|\bcalenders?\b/g, 'calendar'],
  [/\bbussiness(?:es)?\b/g, 'business'],
  [/\bmob\s+apps?\b/g, 'mobile app'],
  [/\be[\s-]?comm?erce\b/g, 'ecommerce'],
  [/\bwebistes?\b|\bwesbites?\b/g, 'website'],
  [/\bwnat\b/g, 'want'],
  [/\bcreat\b/g, 'create'],
  [/\bu\b/g, 'you'],
];

export function normalizeVisitorMessage(value) {
  let text = String(value ?? '')
    .toLowerCase()
    .replace(/[’]/g, "'")
    .replace(/[^a-z0-9\s&+'-]/g, ' ');

  for (const [pattern, replacement] of REPLACEMENTS) {
    text = text.replace(pattern, replacement);
  }

  return text.replace(/\s+/g, ' ').trim();
}
