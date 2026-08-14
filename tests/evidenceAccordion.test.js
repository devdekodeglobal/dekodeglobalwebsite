import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  buildEvidenceAccordion,
  detectEvidenceScope,
} from '../api/_chat/evidenceArtifacts.js';

const component = await readFile(new URL('../src/components/EvidenceAccordion.jsx', import.meta.url), 'utf8');
const styles = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');

test('limits broad case-study requests to the two published case studies', () => {
  for (const question of ['case studies', 'Do you have any case studies?', 'show me your success stories']) {
    const artifact = buildEvidenceAccordion(question);
    assert.equal(artifact.scope, 'case_studies');
    assert.deepEqual(artifact.items.map((item) => item.name), [
      'Food Manufacturing Company',
      'Primary School',
    ]);
  }
});

test('shows the full approved evidence catalogue for broad portfolio requests', () => {
  for (const question of ['show me your portfolio', 'what are dekode projects', 'show me some of ur work']) {
    const artifact = buildEvidenceAccordion(question);
    assert.equal(artifact.scope, 'portfolio');
    assert.deepEqual(artifact.items.map((item) => item.name), [
      'Food Manufacturing Company',
      'Primary School',
      'AttendMe',
      'CHAUFFR',
      'Smart Loan Helper',
      'SmartBroker',
      'Recycled Market',
      'Estrado',
    ]);
  }
});

test('does not attach evidence UI to unrelated, specific, or build-intent messages', () => {
  const questions = [
    'services',
    'pricing',
    'methodology',
    'tell me about Beston',
    'what is CHAUFFR',
    'I want to build a meeting app',
    'I need calendar booking in my website',
    'Can you develop a portfolio website?',
  ];
  for (const question of questions) assert.equal(detectEvidenceScope(question), null, question);
});

test('renders an accessible single-open-item accordion with image-first details', () => {
  assert.match(component, /const \[openId, setOpenId\] = useState\(null\)/);
  assert.match(component, /aria-expanded=\{isOpen\}/);
  assert.match(component, /aria-controls=\{panelId\}/);
  assert.match(component, /<img[\s\S]*<dl className="evidence-facts">/);
  assert.match(styles, /\.evidence-accordion\s*\{[\s\S]*background:\s*transparent/);
  assert.match(styles, /@media \(max-width:\s*700px\)[\s\S]*\.evidence-accordion-trigger/);
});

test('uses readable prose separators for portfolio deliverables', () => {
  const artifact = buildEvidenceAccordion('show me your portfolio');
  const attendMe = artifact.items.find((item) => item.name === 'AttendMe');
  const delivered = attendMe.sections.find((section) => section.label === 'Delivered');
  assert.match(delivered.value, /; /);
  assert.doesNotMatch(delivered.value, /\|/);
});
