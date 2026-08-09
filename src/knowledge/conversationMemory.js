import { detectProjectFocus } from './projectResponseGenerator.js';
import { normalizeVisitorMessage } from './messageNormalization.js';

const VERSION = 1;
const MAX_RECENT_MESSAGES = 8;
const MAX_MESSAGE_LENGTH = 500;
const MAX_REQUIREMENTS = 12;
const MAX_REQUIREMENT_LENGTH = 180;
const MAX_SUMMARY_LENGTH = 1_600;
const PROJECT_STATES = new Set([
  'project_intent_detected',
  'requirement_discovery',
  'sufficiently_qualified',
  'booking_suggested',
  'booking_declined',
  'booking_initiated',
]);
const VALID_STATES = new Set(['informational', ...PROJECT_STATES]);
const DISCOVERY_FIELDS = ['objective', 'users', 'stage', 'timeline', 'integrations', 'constraints'];

const clean = (value, limit = MAX_MESSAGE_LENGTH) => [...String(value || '')]
  .map((character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127 ? ' ' : character)
  .join('')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, limit);

const unique = (items, limit = MAX_REQUIREMENTS) => {
  const deduplicated = [...new Set(items.map((item) => clean(item, MAX_REQUIREMENT_LENGTH)).filter(Boolean))];
  if (deduplicated.length <= limit) return deduplicated;
  const oldestCount = Math.ceil(limit / 2);
  return [...deduplicated.slice(0, oldestCount), ...deduplicated.slice(-(limit - oldestCount))];
};

function createId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `chat-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeSessionId(value) {
  const sessionId = clean(value, 80).replace(/[^a-zA-Z0-9-]/g, '');
  return sessionId.length >= 8 ? sessionId : createId();
}

function emptyProject() {
  return {
    type: '',
    objective: '',
    users: '',
    stage: '',
    timeline: '',
    integrations: '',
    constraints: [],
    requirements: [],
  };
}

export function createConversationMemory(sessionId = createId()) {
  return {
    version: VERSION,
    sessionId: normalizeSessionId(sessionId),
    state: 'informational',
    turnCount: 0,
    projectTurnCount: 0,
    discoveryQuestionCount: 0,
    meaningfulAnswerCount: 0,
    lastIntent: 'informational',
    project: emptyProject(),
    askedFields: [],
    recentMessages: [],
    summary: '',
    booking: { suggested: false, declined: false, initiated: false },
  };
}

export function normalizeConversationMemory(value, legacyHistory = []) {
  const base = createConversationMemory(value?.sessionId);
  const project = value?.project && typeof value.project === 'object' ? value.project : {};
  const sourceMessages = Array.isArray(value?.recentMessages) ? value.recentMessages : legacyHistory;
  return {
    ...base,
    state: VALID_STATES.has(value?.state) ? value.state : base.state,
    turnCount: Math.max(0, Math.min(500, Number(value?.turnCount) || 0)),
    projectTurnCount: Math.max(0, Math.min(100, Number(value?.projectTurnCount) || 0)),
    discoveryQuestionCount: Math.max(0, Math.min(4, Number(value?.discoveryQuestionCount) || 0)),
    meaningfulAnswerCount: Math.max(0, Math.min(20, Number(value?.meaningfulAnswerCount) || 0)),
    lastIntent: clean(value?.lastIntent, 40) || base.lastIntent,
    project: {
      type: clean(project.type, 80),
      objective: clean(project.objective),
      users: clean(project.users),
      stage: clean(project.stage),
      timeline: clean(project.timeline),
      integrations: clean(project.integrations),
      constraints: unique(Array.isArray(project.constraints) ? project.constraints : []),
      requirements: unique(Array.isArray(project.requirements) ? project.requirements : []),
    },
    askedFields: unique(Array.isArray(value?.askedFields) ? value.askedFields : [], DISCOVERY_FIELDS.length)
      .filter((field) => DISCOVERY_FIELDS.includes(field)),
    recentMessages: sourceMessages
      .filter((entry) => entry && (entry.role === 'user' || entry.role === 'model'))
      .map((entry) => ({ role: entry.role, text: clean(entry.text) }))
      .filter((entry) => entry.text)
      .slice(-MAX_RECENT_MESSAGES),
    summary: clean(value?.summary, MAX_SUMMARY_LENGTH),
    booking: {
      suggested: Boolean(value?.booking?.suggested),
      declined: Boolean(value?.booking?.declined),
      initiated: Boolean(value?.booking?.initiated),
    },
  };
}

const extract = {
  users(text) {
    return text.match(/\b(?:for|used by|users? (?:are|include))\s+([^.!?]{3,90})/i)?.[1] || '';
  },
  timeline(text) {
    return text.match(/\b(?:by|within|in)\s+((?:\d+\s+)?(?:days?|weeks?|months?|quarters?)|q[1-4]|january|february|march|april|may|june|july|august|september|october|november|december)[^.!?]*/i)?.[0] || '';
  },
  stage(text) {
    return text.match(/\b(?:new|from scratch|existing|already have|prototype|mvp|redesign|replace|improve|live)\b[^.!?]*/i)?.[0] || '';
  },
  integrations(text) {
    return text.match(/\b(?:integrat(?:e|es|ion|ing)|connect(?:s|ed|ing)?|sync)\b[^.!?]*/i)?.[0] || '';
  },
};

function mergeProjectFacts(project, message) {
  const text = clean(message, 1_000);
  const focus = detectProjectFocus(text);
  const objectiveMatch = text.match(/\b(?:want|need|build|create|develop|improve|automate|solve|enable|allow|help)\b[^.!?]{3,180}/i);
  const constraintMatch = text.match(/\b(?:must|cannot|can't|budget|secure|security|privacy|compliance|constraint|limited)\b[^.!?]{3,160}/ig) || [];
  const requirementLike = /\b(?:want|need|must|should|allow|enable|feature|include|integrat|user|visitor|customer|donat|payment|booking|login|dashboard)\b/i.test(text);
  return {
    ...project,
    type: project.type || focus?.label || '',
    objective: project.objective || clean(objectiveMatch?.[0]),
    users: project.users || clean(extract.users(text)),
    stage: project.stage || clean(extract.stage(text)),
    timeline: project.timeline || clean(extract.timeline(text)),
    integrations: project.integrations || clean(extract.integrations(text)),
    constraints: unique([...project.constraints, ...constraintMatch]),
    requirements: requirementLike ? unique([...project.requirements, text]) : project.requirements,
  };
}

function buildSummary(memory) {
  const facts = [];
  const { project } = memory;
  if (project.type) facts.push(`Project type: ${project.type}.`);
  if (project.objective) facts.push(`Objective: ${project.objective}.`);
  if (project.users) facts.push(`Users: ${project.users}.`);
  if (project.stage) facts.push(`Stage: ${project.stage}.`);
  if (project.timeline) facts.push(`Timeline: ${project.timeline}.`);
  if (project.integrations) facts.push(`Integrations: ${project.integrations}.`);
  if (project.constraints.length) {
    facts.push(`Constraints: ${project.constraints.slice(0, 3).map((item) => clean(item, 100)).join('; ')}.`);
  }
  if (project.requirements.length) {
    const representativeRequirements = unique(project.requirements, 8).map((item) => clean(item, 110));
    facts.push(`Confirmed requirements: ${representativeRequirements.join('; ')}.`);
  }
  if (memory.askedFields.length) facts.push(`Discovery already covered: ${memory.askedFields.join(', ')}.`);
  if (memory.booking.declined) facts.push('The visitor declined or deferred booking; do not suggest it again unless they ask.');
  return clean(facts.join(' '), MAX_SUMMARY_LENGTH);
}

function isBookingDecline(message, memory) {
  if (!memory.booking.suggested) return false;
  const text = normalizeVisitorMessage(message);
  return /\b(no|nope|not now|later|maybe later|do not|don't|dont|continue here|not ready)\b/i.test(text);
}

function isMeaningfulDiscoveryAnswer(message, field) {
  const text = normalizeVisitorMessage(message);
  if (!text || /^(yes|yeah|yep|no|nope|maybe|sure|ok|okay|correct|exactly)$/i.test(text)) return false;
  if (field === 'users' && /\b(user|customer|visitor|team|staff|employee|client|people|student|patient|artist|collector)s?\b/i.test(text)) return true;
  if (field === 'stage' && /\b(new|existing|current|already|prototype|mvp|redesign|replace|live|scratch)\b/i.test(text)) return true;
  if (field === 'timeline' && /\b(day|week|month|quarter|year|deadline|launch|asap|soon|q[1-4])\b/i.test(text)) return true;
  if (field === 'integrations' && /\b(integrat|connect|sync|api|crm|erp|payment|calendar|system|database|shopify|stripe|salesforce)\b/i.test(text)) return true;
  if (field === 'constraints' && /\b(budget|must|cannot|can't|security|privacy|compliance|constraint|limit|risk)\b/i.test(text)) return true;
  return text.length >= 18;
}

function missingField(memory) {
  const candidates = ['objective', 'users', 'stage', 'integrations', 'timeline', 'constraints'];
  return candidates.find((field) => !memory.askedFields.includes(field) && !memory.project[field]?.length) || '';
}

const QUESTIONS = {
  objective: 'What business outcome should this project improve first?',
  users: 'Who will use it most, and what should become easier for them?',
  stage: 'Are you starting from scratch or improving something that already exists?',
  integrations: 'Which existing systems, data sources, or payments should it connect with?',
  timeline: 'Is there a launch date or timing constraint we should plan around?',
  constraints: 'Are there any security, compliance, budget, or operational constraints we should account for?',
};

function coverage(memory) {
  return ['type', 'objective', 'users', 'stage', 'timeline', 'integrations']
    .filter((field) => Boolean(memory.project[field])).length + (memory.project.constraints.length ? 1 : 0);
}

export function beginConversationTurn(value, message, intentKind = 'informational') {
  const previous = normalizeConversationMemory(value);
  const isProject = intentKind === 'project' || PROJECT_STATES.has(previous.state);
  const project = isProject ? mergeProjectFacts(previous.project, message) : previous.project;
  let state = isProject
    ? (previous.projectTurnCount ? 'requirement_discovery' : 'project_intent_detected')
    : (PROJECT_STATES.has(previous.state) ? previous.state : 'informational');
  const booking = { ...previous.booking };
  if (previous.booking.initiated) {
    state = 'booking_initiated';
  } else if (previous.booking.declined || isBookingDecline(message, previous)) {
    state = 'booking_declined';
    booking.declined = true;
  }
  const recentMessages = [...previous.recentMessages, { role: 'user', text: clean(message) }]
    .slice(-MAX_RECENT_MESSAGES);
  const next = {
    ...previous,
    state,
    turnCount: previous.turnCount + 1,
    projectTurnCount: previous.projectTurnCount + (isProject ? 1 : 0),
    meaningfulAnswerCount: previous.meaningfulAnswerCount + (
      isProject && previous.projectTurnCount > 0
      && isMeaningfulDiscoveryAnswer(message, previous.askedFields.at(-1)) ? 1 : 0
    ),
    lastIntent: intentKind,
    project,
    recentMessages,
    booking,
  };
  next.summary = buildSummary(next);
  return {
    memory: next,
    previousState: previous.state,
    compacted: previous.recentMessages.length >= MAX_RECENT_MESSAGES,
  };
}

export function buildConversationDirective(turn) {
  const memory = normalizeConversationMemory(turn?.memory || turn);
  if (memory.booking.initiated) return { mode: 'post_booking', question: '', action: null };
  if (memory.booking.declined) return { mode: 'booking_declined', question: '', action: null };
  if (memory.lastIntent !== 'project' && memory.state !== 'booking_declined') {
    return { mode: 'informational', question: '', action: null };
  }
  if (!PROJECT_STATES.has(memory.state)) return { mode: 'informational', question: '', action: null };
  if (memory.state === 'booking_declined') {
    return { mode: 'booking_declined', question: '', action: null };
  }

  const detailedFirstTurn = memory.projectTurnCount === 1 && coverage(memory) >= 4;
  const sufficientlyQualified = detailedFirstTurn
    || (memory.discoveryQuestionCount >= 2 && memory.meaningfulAnswerCount >= 2)
    || memory.discoveryQuestionCount >= 4;
  if (sufficientlyQualified) {
    return {
      mode: 'qualified',
      question: '',
      action: { type: 'open_booking', label: 'View available times' },
    };
  }

  const field = missingField(memory);
  return {
    mode: 'discovery',
    field,
    question: QUESTIONS[field] || 'What is the most important outcome you want this project to achieve?',
    action: null,
  };
}

export function completeConversationTurn(turn, assistantText, directive = buildConversationDirective(turn)) {
  const memory = normalizeConversationMemory(turn?.memory || turn);
  const askedFields = directive.mode === 'discovery' && directive.field
    ? unique([...memory.askedFields, directive.field], DISCOVERY_FIELDS.length)
    : memory.askedFields;
  const state = directive.mode === 'qualified'
    ? 'booking_suggested'
    : directive.mode === 'discovery' ? 'requirement_discovery' : memory.state;
  const next = {
    ...memory,
    state,
    askedFields,
    discoveryQuestionCount: memory.discoveryQuestionCount + (directive.mode === 'discovery' ? 1 : 0),
    recentMessages: [...memory.recentMessages, { role: 'model', text: clean(assistantText) }]
      .slice(-MAX_RECENT_MESSAGES),
    booking: {
      ...memory.booking,
      suggested: memory.booking.suggested || directive.mode === 'qualified',
    },
  };
  next.summary = buildSummary(next);
  return next;
}

export function markBookingInitiated(value) {
  const memory = normalizeConversationMemory(value);
  const next = {
    ...memory,
    state: 'booking_initiated',
    booking: { ...memory.booking, initiated: true },
  };
  next.summary = buildSummary(next);
  return next;
}

export function conversationMemoryContext(value) {
  const memory = normalizeConversationMemory(value);
  return clean([
    `Conversation state: ${memory.state}.`,
    memory.summary || 'No durable project facts recorded yet.',
  ].join(' '), MAX_SUMMARY_LENGTH + 120);
}

export function enforceConversationDirective(answer, directive) {
  const text = String(answer || '').trim();
  if (!text || !['discovery', 'qualified'].includes(directive?.mode)) return text;
  const statements = text
    .split(/\n+/)
    .flatMap((line) => line.split(/(?<=[.!])\s+/))
    .map((statement) => statement.trim())
    .filter((line) => line && !line.includes('?'));
  const body = statements.join('\n\n').trim();
  if (directive.mode === 'discovery') {
    return `${body}${body ? '\n\n' : ''}${directive.question}`.trim();
  }
  return body || '**Your project is sufficiently defined for a focused delivery conversation.**';
}

export function conversationRetrievalQuery(value, question) {
  const memory = normalizeConversationMemory(value);
  return clean(`${question}\n${memory.summary}`, 3_000);
}

export const conversationMemoryLimits = {
  maxRecentMessages: MAX_RECENT_MESSAGES,
  maxMessageLength: MAX_MESSAGE_LENGTH,
  maxSummaryLength: MAX_SUMMARY_LENGTH,
};
