import test from 'node:test';
import assert from 'node:assert/strict';
import { formatKnowledgeContext, retrieveCompanyKnowledge } from '../api/_chat/companyRetrieval.js';

test('retrieves the most relevant service knowledge instead of the whole website', () => {
  const matches = retrieveCompanyKnowledge('Can DEKODE build an internal AI copilot for our support team?');
  assert.ok(matches.some((match) => match.id === 'service-custom-ai'));
  assert.ok(matches.length <= 5);
  assert.ok(matches.every((match) => match.text.length > 0));
});

test('grounds broad service questions in the DEKODE service catalogue', () => {
  const matches = retrieveCompanyKnowledge('What services does DEKODE offer?');
  assert.ok(matches.some((match) => match.id === 'service-catalogue'));
});

test('builds a bounded context from relevant public knowledge', () => {
  const { context, matches } = formatKnowledgeContext('Which cloud platforms do you support?');
  assert.ok(matches.some((match) => match.id === 'technology'));
  assert.match(context, /AWS/);
  assert.ok(context.length <= 7000);
});

test('includes the old website origin story in company context', () => {
  const { context } = formatKnowledgeContext('Why was DEKODE started?');
  assert.match(context, /businesses that knew they needed to evolve/i);
});

test('retrieves focused knowledge for the new solution labels', () => {
  const cases = [
    ['How can agentic AI automate our workflow?', 'solution-agentic-ai'],
    ['We need demand forecasting with predictive AI', 'solution-predictive-ai'],
    ['Can you help with systems integration?', 'solution-systems-integration'],
    ['Help with process automation for invoice approvals', 'solution-process-automation'],
  ];

  for (const [question, expectedId] of cases) {
    const matches = retrieveCompanyKnowledge(question);
    assert.ok(matches.some((match) => match.id === expectedId), question);
    assert.ok(matches.length <= 5);
  }
});

test('retrieves verified location and legal documents for Gemini grounding', () => {
  const locationMatches = retrieveCompanyKnowledge('Where is the DEKODE office located?');
  const privacyMatches = retrieveCompanyKnowledge("What is DEKODE's privacy policy?");
  const termsMatches = retrieveCompanyKnowledge('What are the terms and conditions?');

  assert.ok(locationMatches.some((match) => match.id === 'locations'));
  assert.ok(privacyMatches.some((match) => match.id === 'privacy-policy'));
  assert.ok(termsMatches.some((match) => match.id === 'terms-of-service'));
  assert.match(privacyMatches.find((match) => match.id === 'privacy-policy').text, /pm@dekodeglobal\.com/);
});

test('retrieves CHAUFFR from the old-site portfolio catalogue', () => {
  const { matches, context } = formatKnowledgeContext('Tell me about CHAUFFR');
  assert.equal(matches[0]?.id, 'portfolio-chauffr');
  assert.match(context, /Android and iOS devices/i);
  assert.match(context, /integrated web portal/i);
});

test('retrieves verified case studies and portfolio work for broad project questions', () => {
  const broadMatches = retrieveCompanyKnowledge('Show me DEKODE case studies and past work');
  const projectMatches = retrieveCompanyKnowledge('what are dekode projects');
  const foodMatches = retrieveCompanyKnowledge('What did DEKODE build for food manufacturing?');
  const schoolMatches = retrieveCompanyKnowledge('Tell me about the AttendMe primary school project');

  assert.equal(broadMatches[0]?.id, 'project-evidence-catalogue');
  assert.equal(projectMatches[0]?.id, 'project-evidence-catalogue');
  assert.ok(foodMatches.some((match) => match.id === 'case-study-food-manufacturing'));
  assert.ok(schoolMatches.some((match) => match.id === 'case-study-primary-school'));
  assert.match(projectMatches[0].text, /CHAUFFR/i);
  assert.match(projectMatches[0].text, /SmartBroker/i);
  assert.match(projectMatches[0].text, /Food Manufacturing Company/i);
});

test('retrieves reviewed delivery, Beston, and BRIDGE evidence', () => {
  assert.equal(retrieveCompanyKnowledge('What happens during discovery?')[0]?.id, 'process-discover');
  assert.equal(retrieveCompanyKnowledge('How did DEKODE help Beston?')[0]?.id, 'case-study-food-manufacturing');
  assert.equal(retrieveCompanyKnowledge('What is BRIDGE?')[0]?.id, 'initiative-bridge');
});
