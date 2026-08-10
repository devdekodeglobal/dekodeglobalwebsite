import { classifyCompanyIntent } from '../knowledge/index.js';

const PROJECT_PATTERNS = /\b(project|build|develop|design|moderni[sz]e|platform|app|website|workflow|automate|customers?|users?)\b/i;

export function classifyVoiceIntent(message, context = {}) {
  const companyIntent = classifyCompanyIntent(message, context.companyContext || {});
  if (companyIntent.kind === 'unsafe') return { ...companyIntent, intent: 'sensitive_refusal' };
  if (companyIntent.isCompanyRelated) return { ...companyIntent, intent: companyIntent.topic === 'contact' ? 'contact_request' : 'company_overview' };
  if (companyIntent.kind === 'meeting') return { ...companyIntent, intent: 'meeting_interest' };
  if (companyIntent.kind === 'meeting_project_ambiguous') return { ...companyIntent, intent: 'meeting_project_clarification' };
  if (/\b(price|pricing|budget|cost)\b/i.test(message)) return { intent: 'pricing_interest', topic: 'project' };
  if (/\b(timeline|deadline|how long|launch)\b/i.test(message)) return { intent: 'timeline_interest', topic: 'project' };
  if (companyIntent.kind === 'project') return { ...companyIntent, intent: 'project_discussion' };
  if (PROJECT_PATTERNS.test(message)) return { intent: 'project_discussion', topic: 'project' };
  if (/^(hi|hello|hey|good morning|good afternoon)\b/i.test(message)) return { intent: 'greeting', topic: 'company' };
  return { intent: 'unrelated_question', topic: context.lastTopic || 'company' };
}
