import test from 'node:test';
import assert from 'node:assert/strict';
import { parseStructuredCompletion, responseSchema } from './structuredResponse.js';

test('Vertex structured response schema requires the routing contract', () => {
  assert.deepEqual(responseSchema.required, ['intent', 'confidence', 'action', 'topic', 'answer']);
  assert.ok(responseSchema.properties.intent.enum.includes('methodology'));
  assert.ok(responseSchema.properties.action.enum.includes('open_calendar'));
});

test('parses a complete structured Vertex response', () => {
  const result = parseStructuredCompletion(JSON.stringify({
    intent: 'methodology',
    confidence: 0.9,
    action: 'show_company_panel',
    topic: 'methodology',
    answer: 'DEKODE uses a structured delivery methodology.',
  }));
  assert.equal(result.intent, 'methodology');
  assert.equal(result.action, 'show_company_panel');
});

test('rejects a partial Vertex response', () => {
  assert.throws(() => parseStructuredCompletion('{"intent":"company_info"}'), /INVALID/);
});
