import test from 'node:test';
import assert from 'node:assert/strict';
import {
  beginConversationTurn,
  buildConversationDirective,
  completeConversationTurn,
  conversationMemoryContext,
  conversationMemoryLimits,
  createConversationMemory,
  markBookingInitiated,
  normalizeConversationMemory,
} from '../src/knowledge/conversationMemory.js';

function exchange(memory, userText, assistantText = 'Understood.') {
  const turn = beginConversationTurn(memory, userText, 'project');
  const directive = buildConversationDirective(turn);
  return {
    directive,
    memory: completeConversationTurn(turn, assistantText, directive),
  };
}

test('keeps durable facts while bounding a twenty-turn conversation', () => {
  let memory = createConversationMemory('long-session');
  ({ memory } = exchange(memory, 'I need a website where art collectors can donate to artists.'));
  for (let index = 1; index <= 19; index += 1) {
    ({ memory } = exchange(memory, `Requirement ${index}: users should manage gallery item ${index}.`));
  }

  assert.equal(memory.turnCount, 20);
  assert.ok(memory.recentMessages.length <= conversationMemoryLimits.maxRecentMessages);
  assert.match(memory.summary, /art collectors can donate to artists/i);
  assert.ok(memory.summary.length <= conversationMemoryLimits.maxSummaryLength);
  assert.ok(conversationMemoryContext(memory).length <= conversationMemoryLimits.maxSummaryLength + 120);
});

test('qualifies a normal project after useful discovery without repeating fields', () => {
  let memory = createConversationMemory('standard-project');
  let result = exchange(memory, 'We need AI for our customer support team.');
  memory = result.memory;
  assert.equal(result.directive.mode, 'discovery');

  result = exchange(memory, 'Our support agents and existing customers will use it.');
  memory = result.memory;
  assert.equal(result.directive.mode, 'discovery');
  assert.equal(new Set(memory.askedFields).size, memory.askedFields.length);

  result = exchange(memory, 'It is a new system that must connect to our CRM.');
  assert.equal(result.directive.mode, 'qualified');
  assert.deepEqual(result.directive.action, { type: 'open_booking', label: 'View available times' });
});

test('does not treat vague acknowledgements as useful discovery answers', () => {
  let memory = createConversationMemory('vague-project');
  ({ memory } = exchange(memory, 'I need a website for my business.'));
  ({ memory } = exchange(memory, 'yes'));
  const third = exchange(memory, 'okay');
  assert.equal(third.directive.mode, 'discovery');
  assert.equal(third.memory.meaningfulAnswerCount, 0);
});

test('qualifies a detailed first message immediately', () => {
  const memory = createConversationMemory('detailed-project');
  const turn = beginConversationTurn(
    memory,
    'We need a new ecommerce website for retail customers from scratch, integrating Stripe, with a launch in 3 months.',
    'project',
  );
  const directive = buildConversationDirective(turn);
  assert.equal(directive.mode, 'qualified');
  assert.equal(directive.action.type, 'open_booking');
});

test('company questions do not trigger project discovery or booking', () => {
  const memory = createConversationMemory('company-session');
  const turn = beginConversationTurn(memory, 'Where is DEKODE located?', 'company');
  const directive = buildConversationDirective(turn);
  assert.equal(directive.mode, 'informational');
  assert.equal(directive.action, null);
  assert.equal(turn.memory.state, 'informational');
});

test('a declined meeting is remembered and not suggested again', () => {
  let memory = createConversationMemory('declined-session');
  memory = normalizeConversationMemory({
    ...memory,
    state: 'booking_suggested',
    lastIntent: 'project',
    projectTurnCount: 3,
    booking: { suggested: true, declined: false, initiated: false },
  });
  const turn = beginConversationTurn(memory, 'Not now, continue here.', 'project');
  const directive = buildConversationDirective(turn);
  const completed = completeConversationTurn(turn, 'No problem.', directive);
  assert.equal(directive.mode, 'booking_declined');
  assert.equal(directive.action, null);
  assert.equal(completed.state, 'booking_declined');
  assert.equal(completed.booking.declined, true);
});

test('booking initiation uses the existing state envelope', () => {
  const initiated = markBookingInitiated(createConversationMemory('booking-session'));
  assert.equal(initiated.state, 'booking_initiated');
  assert.equal(initiated.booking.initiated, true);
  const followUp = beginConversationTurn(initiated, 'Can you also explain your web experience?', 'project');
  assert.equal(buildConversationDirective(followUp).mode, 'post_booking');
  assert.equal(buildConversationDirective(followUp).action, null);
});

test('records a booking suggestion selection without losing project facts', () => {
  let memory = createConversationMemory('suggestion-booking');
  memory = exchange(memory, 'I want to build an Android app for field staff.').memory;
  const turn = beginConversationTurn(
    memory,
    'I would like to book a discovery call to discuss my Android app idea.',
    'meeting',
    { type: 'suggestion', intent: 'book_meeting', action: 'open_calendar' },
  );
  assert.equal(turn.memory.booking.requested, true);
  assert.match(turn.memory.summary, /Android/i);
  assert.match(turn.memory.summary, /explicitly selected or requested a discovery call/i);
});

test('sessions remain isolated and malformed client state is sanitized', () => {
  const first = createConversationMemory('first-session');
  const second = createConversationMemory('second-session');
  const firstTurn = exchange(first, 'I need a mobile app for students.').memory;
  assert.notEqual(firstTurn.sessionId, second.sessionId);
  assert.equal(second.project.type, '');

  const sanitized = normalizeConversationMemory({
    sessionId: '<bad> session',
    state: 'invented-state',
    recentMessages: Array.from({ length: 30 }, (_, index) => ({ role: 'user', text: `turn ${index}` })),
  });
  assert.equal(sanitized.state, 'informational');
  assert.equal(sanitized.recentMessages.length, conversationMemoryLimits.maxRecentMessages);
  assert.doesNotMatch(sanitized.sessionId, /[<>\s]/);
});
