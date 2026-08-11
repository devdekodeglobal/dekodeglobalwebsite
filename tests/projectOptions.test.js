import test from 'node:test';
import assert from 'node:assert/strict';
import {
  findProjectOption,
  PROJECT_OPTIONS,
} from '../src/config/projectOptions.js';
import {
  detectProjectFocus,
  generateProjectResponse,
  isProjectRequest,
} from '../src/knowledge/projectResponseGenerator.js';
import {
  buildProjectConversationQuery,
  isProjectContinuation,
} from '../src/knowledge/projectConversation.js';
import { resolveVisualFeatures, resolveVisualMode } from '../src/utils/visualIntent.js';

const EXPECTED_LABELS = [
  'AI Strategy',
  'AI Automation',
  'Mobile & Web',
  'Cloud Solutions',
];

test('uses the approved project labels exactly once', () => {
  const labels = PROJECT_OPTIONS.map((option) => option.label);
  assert.deepEqual(labels, EXPECTED_LABELS);
  assert.equal(new Set(labels).size, labels.length);
});

test('maps common wording to the right project category', () => {
  assert.equal(findProjectOption('I need a GenAI copilot')?.label, 'AI Automation');
  assert.equal(findProjectOption('Build an AI agent for sales')?.label, 'AI Automation');
  assert.equal(findProjectOption('Move our systems to the cloud')?.label, 'Cloud Solutions');
  assert.equal(findProjectOption('A web application for customers')?.label, 'Mobile & Web');
});

test('understands an explicit website request without asking for the platform again', () => {
  const response = generateProjectResponse('I want to create a website');
  assert.equal(response.projectType, 'Web App');
  assert.match(response.text, /^\*\*A website, understood\.\*\*/);
  assert.match(response.text, /what should the website help visitors do/i);
  assert.doesNotMatch(response.text, /mobile app \(iOS\/Android\)|web application, or both/i);
});

test('tolerates common spelling mistakes in project intent', () => {
  assert.equal(detectProjectFocus('I wnat to creat a webiste')?.id, 'website');
  assert.equal(isProjectRequest('I wnat to creat a webiste'), true);
});

test('recognises a shared operational problem as a project conversation', () => {
  assert.equal(
    isProjectRequest('Our team spends too much time copying data between systems'),
    true,
  );
  assert.equal(
    detectProjectFocus('Our manual workflow involves repetitive data entry')?.id,
    'automation',
  );
});

test('keeps capability questions in the company-information route', () => {
  assert.equal(isProjectRequest('Can you build websites?'), false);
});

test('preserves a project brief across short conversational follow-ups', () => {
  const history = [
    { role: 'user', text: 'I want to build a website' },
    { role: 'model', text: 'What should visitors do there?' },
    { role: 'user', text: 'I want to show art on my website.' },
    { role: 'model', text: 'Should visitors only view the art?' },
  ];
  assert.equal(isProjectContinuation('yes, they can donate for the art work.', history, 'out_of_scope'), true);
  assert.equal(isProjectContinuation('yes', history, 'ambiguous'), true);
  assert.match(buildProjectConversationQuery('yes', history), /show art on my website/i);
});

test('does not absorb a clear company-information switch into project context', () => {
  const history = [{ role: 'user', text: 'I want to build a website' }];
  assert.equal(isProjectContinuation('Where is DEKODE located?', history, 'company'), false);
});

test('builds the supporting visual from accumulated visitor requirements', () => {
  const messages = [
    { sender: 'user', text: 'I want to build a website to show art.' },
    { sender: 'user', text: 'Visitors can donate for the artwork.' },
  ];
  assert.equal(resolveVisualMode('Web App', messages), 'journey');
  assert.deepEqual(resolveVisualFeatures(messages), ['Gallery', 'Donations']);
});
