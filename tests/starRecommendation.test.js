import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isStarTrustIntent,
  routeStarTrustSuggestion,
  STAR_TRUST_SUGGESTION,
} from '../src/knowledge/starRecommendation.js';

const regularSuggestions = [
  { label: 'View services', prompt: 'What services does DEKODE offer?', kind: 'follow_up' },
  { label: 'See a case study', prompt: 'Show me a relevant case study.', kind: 'discovery' },
];

test('recognizes genuine trust and differentiation evaluation', () => {
  for (const question of [
    'Why should I choose DEKODE?',
    'What makes DEKODE different from other agencies?',
    'Can we trust your team to deliver?',
    'How do you ensure transparency and accountability?',
    'Are you reliable after launch?',
  ]) {
    assert.equal(isStarTrustIntent(question), true, question);
  }
});

test('does not treat ordinary company, methodology, or product requests as STAR trust intent', () => {
  for (const question of [
    'What services does DEKODE offer?',
    'How does your methodology work?',
    'Show me your portfolio.',
    'Can you build a transparent reporting dashboard?',
    'I want to create a reliable mobile app.',
    "What are DEKODE's STAR principles?",
  ]) {
    assert.equal(isStarTrustIntent(question), false, question);
  }
});

test('guarantees one canonical STAR pill for trust evaluation without changing follow-ups', () => {
  assert.deepEqual(
    routeStarTrustSuggestion(regularSuggestions, 'What makes DEKODE different?'),
    [STAR_TRUST_SUGGESTION, regularSuggestions[0]],
  );
});

test('does not repeat STAR after it was shown or when STAR was asked directly', () => {
  assert.deepEqual(
    routeStarTrustSuggestion(regularSuggestions, 'Why should we trust DEKODE?', ['Why clients trust DEKODE']),
    regularSuggestions,
  );
  assert.deepEqual(
    routeStarTrustSuggestion([STAR_TRUST_SUGGESTION, regularSuggestions[0]], "Explain DEKODE's STAR principles"),
    [regularSuggestions[0]],
  );
});
