import companyKnowledge from '../../../src/knowledge/companyKnowledge.json' with { type: 'json' };
import { normalizeVisitorMessage } from '../../../src/knowledge/messageNormalization.js';

const FACTUAL_INTENTS = new Set(['company_info', 'pricing', 'case_study', 'methodology']);
const PROJECT_EVIDENCE_PATTERN = /\b(?:projects?|portfolio|past work|previous work|client work|examples?|case studies|success stories|clients?|what have you built|show me (?:some of )?(?:your )?work|what work (?:have you done|did you do))\b/i;
const HISTORICAL_CLAIM_PATTERN = /\b(?:dekode|we)\b.{0,60}\b(?:built|delivered|developed|created|worked with|client|case study|project)\b/i;
const STOP_WORDS = new Set([
  'about', 'after', 'also', 'answer', 'because', 'been', 'being', 'could', 'does',
  'from', 'have', 'help', 'into', 'more', 'only', 'other', 'that', 'their', 'there',
  'these', 'they', 'this', 'through', 'what', 'when', 'where', 'which', 'with',
  'would', 'your', 'dekode', 'hello', 'sure', 'glad', 'here', 'please', 'thanks',
  'thank', 'welcome', 'great', 'good', 'morning', 'afternoon', 'evening', 'happy',
  'like', 'want', 'need', 'would', 'could', 'should', 'will', 'going', 'does',
  'doing', 'done', 'make', 'made', 'take', 'taken', 'give', 'given', 'find',
  'found', 'show', 'shown', 'yes', 'no', 'okay', 'well', 'many', 'very', 'just',
]);

const normalize = (value) => String(value || '')
  .toLowerCase()
  .replace(/[^a-z0-9+&\s-]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const tokens = (value) => [...new Set(normalize(value).match(/[a-z0-9+&-]{4,}/g) || [])]
  .filter((token) => !STOP_WORDS.has(token));

const approvedEvidenceNames = [
  ...(companyKnowledge.portfolioProjects || []).flatMap((project) => [project.name, ...(project.aliases || [])]),
  ...(companyKnowledge.caseStudies || []).flatMap((study) => [study.name, ...(study.aliases || [])]),
].map(normalize).filter((name) => name.length >= 4);

export function isProjectEvidenceQuestion(question) {
  const query = normalizeVisitorMessage(question);
  if (/\b(methodology|delivery process|deliver projects?|how (?:do|does) .{0,16}work|project lifecycle)\b/i.test(query)) return false;
  if (/\b(?:domain|industry|industries|sector)s?\b/i.test(query) && !/\b(?:projects?|case stud(?:y|ies))\b/i.test(query)) return false;
  if (/\b(?:my|our|this|new|a)\s+projects?\b/i.test(query)) return false;
  return PROJECT_EVIDENCE_PATTERN.test(query);
}

export function requiresCompanyGrounding(result, question) {
  if (FACTUAL_INTENTS.has(result?.intent) || result?.action === 'show_company_panel') return true;
  return (result?.intent === 'project_build' && HISTORICAL_CLAIM_PATTERN.test(String(result?.answer || '')))
    || isProjectEvidenceQuestion(question);
}

export function isGroundedCompanyResult(result, question, matches = []) {
  if (!requiresCompanyGrounding(result, question)) return true;
  if (!Array.isArray(matches) || matches.length === 0) return false;

  const answer = String(result?.answer || '');
  const sourceText = matches.map((match) => `${match.label || ''} ${match.text || ''}`).join(' ');
  const answerTokens = tokens(answer);
  const sourceTokens = new Set(tokens(sourceText));
  if (answerTokens.length === 0) return false;

  const supportedTokens = answerTokens.filter((token) => sourceTokens.has(token)).length;
  const coverage = supportedTokens / answerTokens.length;
  const normalizedAnswer = normalize(answer);

  // Bypass grounding if Gemini is explicitly stating it does not have the project/information
  const rawAnswer = String(result?.answer || '');
  const NEGATIVE_PATTERN = /\b(?:don'?t\s+have|do\s+not\s+have|no\s+project|not\s+on\s+file|no\s+case\s+study|don'?t\s+find|do\s+not\s+find|no\s+record|no\s+information|unable\s+to\s+find|cannot\s+find|not\s+find|no\s+mention|no\s+details?)\b/i;
  if (NEGATIVE_PATTERN.test(rawAnswer)) {
    return true;
  }

  if (isProjectEvidenceQuestion(question) || result?.intent === 'case_study') {
    const hasEvidenceProjects = Array.isArray(result?.evidenceProjects) && result.evidenceProjects.length > 0;
    const evidenceProjectsVerified = hasEvidenceProjects && result.evidenceProjects.some((projName) =>
      approvedEvidenceNames.some((approvedName) => approvedName.includes(normalize(projName)) || normalize(projName).includes(approvedName))
    );
    if (evidenceProjectsVerified) {
      return true;
    }
    const namesVerified = approvedEvidenceNames.some((name) => normalizedAnswer.includes(name));
    return namesVerified && coverage >= 0.20;
  }
  return coverage >= 0.05;
}
