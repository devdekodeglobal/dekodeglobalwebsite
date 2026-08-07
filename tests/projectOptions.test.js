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
