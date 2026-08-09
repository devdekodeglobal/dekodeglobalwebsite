import { findTopic } from './knowledgeIndex.js';
import { normalizeVisitorMessage } from './messageNormalization.js';
import { isProjectRequest } from './projectResponseGenerator.js';
import { getSensitiveRequestRefusal } from './safetyResponse.js';

const OUT_OF_SCOPE_PATTERNS = [
  /\b(tell|write|make).{0,12}\b(joke|poem|story|code)\b/i,
  /\b(explain|teach me)\s+(react|javascript|python|history|science)\b/i,
  /\b(who won|weather|news|time|translate)\b/i,
];

const GREETING_PATTERNS = [/^(hello|hi|hey|thanks|thank you)\b[.!?\s]*$/i];

const MEETING_REQUEST_PATTERNS = [
  /^(?:please\s+)?(?:book|meet|meeting|calendar|booking)$/i,
  /\b(calendar|booking)\b/i,
  /\b(book|schedule|arrange|set up)\b.{0,28}\b(meet|meeting|call|consultation|discovery call)\b/i,
  /\b(want|need|like|can i|could i)\b.{0,28}\b(meet|meeting|call|talk)\b/i,
  /\b(meet|meeting|call|consultation|discovery call|talk)\b.{0,28}\b(someone|team|availability|available|slot|time|book|schedule)\b/i,
];

const ORIGIN_PATTERNS = [
  /\bwhy\b.{0,32}\b(dekode|company|you)\b.{0,28}\b(start|started|found|founded|create|created|begin|began)\b/i,
  /\bwhy\b.{0,32}\b(start|started|found|founded|create|created)\b.{0,28}\b(dekode|company|you)\b/i,
];

const CLEAR_EXTERNAL_QUESTION = /^(who|what|when|where|why|how)\b/i;

const COMPANY_CUES = [
  /\bdekode\b/i,
  /\b(your|the)\s+(company|business|services?|capabilities|team|culture|values?|technolog(?:y|ies)|stack|process|clients?|industr(?:y|ies)|projects?|work|case studies|success stories|locations?|address|privacy|terms|polic(?:y|ies))\b/i,
  /\b(who are you|what do you do|why (?:should i )?choose you|how do you work)\b/i,
  /\bhow do you\s+(?:approach|deliver|manage|run|support|take)\b/i,
  /\b(do|can)\s+you\s+(build|provide|offer|support|work|help|develop|design)\b/i,
  /\bwhat\s+(?:services?|solutions?|industries|technologies)\s+do\s+you\b/i,
  /\b(where are you|where (?:is|are).{0,20}(?:office|located|based)|office address|headquarters|privacy policy|terms (?:and conditions|of service))\b/i,
  /\b(contact us|contact information|email address|phone number|company location)\b/i,
  /\b(what (?:have|has) you built|work have you done|show me your work|case stud(?:y|ies)|success stor(?:y|ies)|past projects?)\b/i,
];

const SHORT_COMPANY_TOPICS = /^(about|company|services?|capabilities|industr(?:y|ies)|technolog(?:y|ies)|tech stack|process|case studies|success stories|portfolio|past work|contact|location|locations|privacy|privacy policy|terms|terms and conditions|terms of service|why dekode)$/i;

export function classifyCompanyIntent(message, context = {}) {
  const text = normalizeVisitorMessage(message);
  if (!text) return { isCompanyRelated: false, topic: null, kind: 'ambiguous' };
  if (GREETING_PATTERNS.some((pattern) => pattern.test(text))) {
    return { isCompanyRelated: false, topic: null, kind: 'greeting' };
  }
  if (MEETING_REQUEST_PATTERNS.some((pattern) => pattern.test(text))) {
    return { isCompanyRelated: false, topic: 'meeting', kind: 'meeting' };
  }
  if (getSensitiveRequestRefusal(text)) {
    return { isCompanyRelated: false, topic: null, kind: 'unsafe' };
  }
  if (OUT_OF_SCOPE_PATTERNS.some((pattern) => pattern.test(text))) {
    return { isCompanyRelated: false, topic: null, kind: 'out_of_scope' };
  }
  if (isProjectRequest(text)) {
    return { isCompanyRelated: false, topic: null, kind: 'project' };
  }
  if (ORIGIN_PATTERNS.some((pattern) => pattern.test(text))) {
    return { isCompanyRelated: true, topic: 'origin', kind: 'company' };
  }

  const match = findTopic(text);
  const hasCompanyCue = COMPANY_CUES.some((pattern) => pattern.test(text));
  const asksAboutSolution =
    Boolean(match.solutionArea) &&
    /\b(what is|tell me about|do you|can you|offer|provide|help with|explain)\b/i.test(text);
  const asksAboutPortfolio = Boolean(match.portfolioProject);
  const asksAboutVerifiedEntity = Boolean(match.caseStudy || match.initiative || match.developmentStep);
  const contextualFollowUp =
    context.isCompanyConversation &&
    (match.score > 0 || /^(what about|how about|and|also|tell me more|why|how|which|do you|can you)\b/i.test(text));

  const isShortCompanyTopic = SHORT_COMPANY_TOPICS.test(text);
  const isCompanyRelated = hasCompanyCue || asksAboutSolution || asksAboutPortfolio || asksAboutVerifiedEntity || contextualFollowUp || isShortCompanyTopic;

  if (!isCompanyRelated && !match.topic && CLEAR_EXTERNAL_QUESTION.test(text)) {
    return { isCompanyRelated: false, topic: null, kind: 'out_of_scope' };
  }

  return {
    isCompanyRelated,
    kind: isCompanyRelated ? 'company' : 'ambiguous',
    topic: match.topic || (contextualFollowUp ? context.lastTopic : null) || 'company',
    service: match.service,
    solutionArea: match.solutionArea,
    portfolioProject: match.portfolioProject,
    caseStudy: match.caseStudy,
    initiative: match.initiative,
    developmentStep: match.developmentStep,
  };
}
