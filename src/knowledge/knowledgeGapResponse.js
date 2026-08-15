import { loadCompanyKnowledge } from './companyKnowledgeLoader.js';
import { normalizeVisitorMessage } from './messageNormalization.js';

const knowledge = loadCompanyKnowledge();

const FOUNDING_DATE_PATTERNS = [
  /\b(when|what year|how long ago|how old)\b.{0,40}\b(start|started|found|founded|establish|established|launch|launched)\b/i,
  /\b(start|started|found|founded|establish|established|launch|launched)\b.{0,40}\b(yesterday|today|when|what year|how long ago)\b/i,
];

const PRICING_PATTERNS = [
  /\b(how much|exact price|pricing|price list|hourly rate|day rate)\b/i,
  /\bwhat.{0,20}\b(cost|charge)\b/i,
  /\b(tell|show|need|give|share)\b.{0,16}\b(price|pricing|cost|quote|estimate)\b/i,
];

const UNVERIFIED_LEADERSHIP_TITLE_PATTERNS = [
  /\bwho\b.{0,24}\b(ceo|director|managing director|chair(?:person|man)?)\b/i,
  /\b(ceo|director|managing director|chair(?:person|man)?)\b.{0,24}\bdekode\b/i,
];

export function getKnowledgeGapResponse(message) {
  const text = normalizeVisitorMessage(message);

  if (FOUNDING_DATE_PATTERNS.some((pattern) => pattern.test(text))) {
    return `DEKODE's public company information does not list an exact founding date, so I can't confirm whether it started yesterday.\n\nWhat it does explain is why DEKODE was created: ${knowledge.company.origin}`;
  }

  if (UNVERIFIED_LEADERSHIP_TITLE_PATTERNS.some((pattern) => pattern.test(text))) {
    return "DEKODE's published company information names Pankaj Banga as Founder, but it does not name a CEO, director, or chairperson, so I won't assign an unsupported title.";
  }

  if (PRICING_PATTERNS.some((pattern) => pattern.test(text))) {
    return `DEKODE does not publish fixed pricing because scope depends on the problem, product, integrations, security, and support required. For an accurate estimate, contact ${knowledge.contact.email} with a short description of what you want to build.`;
  }

  return null;
}
