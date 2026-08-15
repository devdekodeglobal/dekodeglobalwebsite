import { resolveCalendarIntent, scoreCompetingIntents } from './intentClassifier.js';
import { getSensitiveRequestRefusal } from './safetyResponse.js';

export const MODEL_INTENTS = [
  'company_info',
  'project_build',
  'book_meeting',
  'pricing',
  'case_study',
  'methodology',
  'safety_refusal',
  'out_of_scope',
  'clarification',
];

export const MODEL_ACTIONS = [
  'answer',
  'open_calendar',
  'show_project_panel',
  'show_company_panel',
  'ask_clarification',
  'refuse',
];

const DEFAULT_RESULT = {
  intent: 'clarification',
  confidence: 0.5,
  action: 'answer',
  topic: 'general',
};

function sanitizeSuggestions(value) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  return value.flatMap((suggestion) => {
    const label = String(suggestion?.label || '').trim().slice(0, 42);
    const prompt = String(suggestion?.prompt || '').trim().slice(0, 180);
    const key = label.toLowerCase();
    if (!label || !prompt || seen.has(key)) return [];
    seen.add(key);
    const suggestionRoute = scoreCompetingIntents(prompt).route;
    const inferredIntent = suggestionRoute === 'meeting'
      ? 'book_meeting'
      : suggestionRoute === 'project' ? 'project_build' : undefined;
    const inferredAction = suggestionRoute === 'meeting'
      ? 'open_calendar'
      : suggestionRoute === 'project' ? 'show_project_panel' : undefined;
    const intent = MODEL_INTENTS.includes(suggestion?.intent) ? suggestion.intent : inferredIntent;
    const action = MODEL_ACTIONS.includes(suggestion?.action) ? suggestion.action : inferredAction;
    const kind = suggestion?.kind === 'discovery' ? 'discovery' : 'follow_up';
    return [{ label, prompt, kind, ...(intent ? { intent } : {}), ...(action ? { action } : {}) }];
  }).slice(0, 4);
}

export function parseStructuredModelText(value) {
  if (value && typeof value === 'object') return value;
  const text = String(value || '').trim();
  if (!text) return null;
  const unfenced = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  try {
    return JSON.parse(unfenced);
  } catch {
    return { ...DEFAULT_RESULT, answer: text };
  }
}

export function validateModelResponse(candidate, originalMessage, context = {}) {
  const parsed = parseStructuredModelText(candidate) || {};
  const safetyAnswer = getSensitiveRequestRefusal(originalMessage);
  if (safetyAnswer) {
    return {
      intent: 'safety_refusal',
      confidence: 1,
      action: 'refuse',
      topic: 'safety',
      answer: safetyAnswer,
    };
  }

  const parsedConfidence = Number(parsed.confidence);
  const confidence = isNaN(parsedConfidence)
    ? DEFAULT_RESULT.confidence
    : Math.max(0, Math.min(1, parsedConfidence));

  const result = {
    intent: MODEL_INTENTS.includes(parsed.intent) ? parsed.intent : DEFAULT_RESULT.intent,
    confidence,
    action: MODEL_ACTIONS.includes(parsed.action) ? parsed.action : DEFAULT_RESULT.action,
    topic: String(parsed.topic || DEFAULT_RESULT.topic).trim().slice(0, 80),
    answer: String(parsed.answer || '').trim() || "I'm sorry, I encountered an issue processing that response. How else can I help?",
    suggestions: sanitizeSuggestions(parsed.suggestions),
    evidenceProjects: Array.isArray(parsed.evidenceProjects)
      ? parsed.evidenceProjects.map((p) => String(p).trim()).filter(Boolean)
      : [],
  };

  return result;
}
