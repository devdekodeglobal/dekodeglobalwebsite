import { findTopic } from './knowledgeIndex.js';

const OUT_OF_SCOPE_PATTERNS = [
  /\b(tell|write|make).{0,12}\b(joke|poem|story|code)\b/i,
  /\b(explain|teach me)\s+(react|javascript|python|history|science)\b/i,
  /\b(who won|weather|news|time|translate)\b/i,
];

const GREETING_PATTERNS = [/^(hello|hi|hey|thanks|thank you)\b[.!?\s]*$/i];

const PROJECT_REQUEST_PATTERNS = [
  /\b(i|we)\s+(want|need|would like|are looking)\b/i,
  /\b(build|create|develop|design)\s+(me|us|my|our)\b/i,
  /\bhelp\s+(me|us)\s+(build|create|develop|design)\b/i,
  /\bmy\s+(app|application|website|platform|project|idea)\b/i,
  /\bwhat\s+(?:should|could|can)\s+(?:i|we)\s+(?:build|create)\b/i,
  /\b(project|product|app|website)\s+idea\b/i,
];

const CLEAR_EXTERNAL_QUESTION = /^(who|what|when|where|why|how)\b/i;

const COMPANY_CUES = [
  /\bdekode\b/i,
  /\b(your|the)\s+(company|business|services?|capabilities|team|culture|values?|technolog(?:y|ies)|stack|process|clients?|industr(?:y|ies)|locations?|address|privacy|terms|polic(?:y|ies))\b/i,
  /\b(who are you|what do you do|why (?:should i )?choose you|how do you work)\b/i,
  /\b(do|can)\s+you\s+(build|provide|offer|support|work|help|develop|design)\b/i,
  /\bwhat\s+(?:services?|solutions?|industries|technologies)\s+do\s+you\b/i,
  /\b(where are you|where (?:is|are).{0,20}(?:office|located|based)|office address|headquarters|privacy policy|terms (?:and conditions|of service))\b/i,
  /\b(contact us|contact information|email address|phone number|company location)\b/i,
];

const SHORT_COMPANY_TOPICS = /^(about|company|services?|capabilities|industr(?:y|ies)|technolog(?:y|ies)|tech stack|process|contact|location|locations|privacy|privacy policy|terms|terms and conditions|terms of service|why dekode)$/i;

export function classifyCompanyIntent(message, context = {}) {
  const text = message.trim();
  if (!text) return { isCompanyRelated: false, topic: null, kind: 'ambiguous' };
  if (GREETING_PATTERNS.some((pattern) => pattern.test(text))) {
    return { isCompanyRelated: false, topic: null, kind: 'greeting' };
  }
  if (OUT_OF_SCOPE_PATTERNS.some((pattern) => pattern.test(text))) {
    return { isCompanyRelated: false, topic: null, kind: 'out_of_scope' };
  }
  if (PROJECT_REQUEST_PATTERNS.some((pattern) => pattern.test(text))) {
    return { isCompanyRelated: false, topic: null, kind: 'project' };
  }

  const match = findTopic(text);
  const hasCompanyCue = COMPANY_CUES.some((pattern) => pattern.test(text));
  const asksAboutSolution =
    Boolean(match.solutionArea) &&
    /\b(what is|tell me about|do you|can you|offer|provide|help with|explain)\b/i.test(text);
  const contextualFollowUp =
    context.isCompanyConversation &&
    (match.score > 0 || /^(what about|how about|and|also|tell me more|why|how|which|do you|can you)\b/i.test(text));

  const isShortCompanyTopic = SHORT_COMPANY_TOPICS.test(text);
  const isCompanyRelated = hasCompanyCue || asksAboutSolution || contextualFollowUp || isShortCompanyTopic;

  if (!isCompanyRelated && !match.topic && CLEAR_EXTERNAL_QUESTION.test(text)) {
    return { isCompanyRelated: false, topic: null, kind: 'out_of_scope' };
  }

  return {
    isCompanyRelated,
    kind: isCompanyRelated ? 'company' : 'ambiguous',
    topic: match.topic || (contextualFollowUp ? context.lastTopic : null) || 'company',
    service: match.service,
    solutionArea: match.solutionArea,
  };
}
