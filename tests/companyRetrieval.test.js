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
  assert.match(privacyMatches.find((match) => match.id === 'privacy-policy').text, /contactus@dekodeglobal\.com/);
  assert.doesNotMatch(privacyMatches.find((match) => match.id === 'privacy-policy').text, /pm@dekodeglobal\.com/);
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

test('prioritises project evidence across portfolio and case-study wording', () => {
  const broadQueries = [
    'what are dekode projects',
    'show me your portfolio',
    'what projects has dekode built',
    'case studies',
  ];

  for (const question of broadQueries) {
    const matches = retrieveCompanyKnowledge(question);
    assert.equal(matches[0]?.id, 'project-evidence-catalogue', question);
    assert.doesNotMatch(matches[0]?.id || '', /company-overview/, question);
  }

  assert.equal(retrieveCompanyKnowledge('tell me about Beston')[0]?.id, 'case-study-food-manufacturing');
  assert.equal(retrieveCompanyKnowledge('what is CHAUFFR')[0]?.id, 'portfolio-chauffr');

  const school = retrieveCompanyKnowledge('what platform was used for the primary school solution');
  assert.equal(school[0]?.id, 'case-study-primary-school');
  assert.match(school[0]?.text || '', /Amazon Web Services|AWS/i);
});

test('includes structured old-site evidence in project documents', () => {
  const chauffr = retrieveCompanyKnowledge('what is CHAUFFR')[0];
  const beston = retrieveCompanyKnowledge('tell me about Beston')[0];

  assert.match(chauffr.text, /Platform: Android, iOS, and web/i);
  assert.match(chauffr.text, /Deliverables:/i);
  assert.match(beston.text, /Obstacles:/i);
  assert.match(beston.text, /Delivery approach:/i);
});

test('retrieves reviewed delivery, Beston, and BRIDGE evidence', () => {
  assert.equal(retrieveCompanyKnowledge('What happens during discovery?')[0]?.id, 'process-discovery');
  assert.equal(retrieveCompanyKnowledge('How did DEKODE help Beston?')[0]?.id, 'case-study-food-manufacturing');
  assert.equal(retrieveCompanyKnowledge('What is BRIDGE?')[0]?.id, 'initiative-bridge');
});

test('retrieves the six-stage methodology and verified founder details', () => {
  const methodology = retrieveCompanyKnowledge('How does DEKODE deliver projects?')[0];
  const founder = retrieveCompanyKnowledge('Who is behind DEKODE?')[0];
  const directFounder = retrieveCompanyKnowledge('Who is founder of DEKODE company?')[0];
  assert.equal(methodology.id, 'delivery-process');
  assert.match(methodology.text, /Discovery:[\s\S]*Prototype:[\s\S]*Design:[\s\S]*Build:[\s\S]*Deploy:[\s\S]*Evolve:/);
  assert.equal(founder.id, 'company-leadership');
  assert.equal(directFounder.id, 'company-leadership');
  assert.match(founder.text, /Pankaj Banga/);
  assert.match(founder.text, /linkedin\.com\/in\/pankajbanga/);
});

test('retrieves approved contact-page FAQ answers', () => {
  const responseTime = retrieveCompanyKnowledge('How quickly do you respond?');
  const outsideAustralia = retrieveCompanyKnowledge('Do you work with businesses outside Australia?');
  const pricing = retrieveCompanyKnowledge('How much does it cost?');
  const roughIdea = retrieveCompanyKnowledge('Do I need to know what I want before reaching out?');
  const existingTools = retrieveCompanyKnowledge('Can you work with our existing team or tools?');

  assert.ok(responseTime.some((match) => /Typically within 24 hours on business days/i.test(match.text)));
  assert.ok(outsideAustralia.some((match) => /work globally/i.test(match.text)));
  assert.ok(pricing.some((match) => /clear, transparent estimate after the discovery call/i.test(match.text)));
  assert.ok(roughIdea.some((match) => /rough idea or a problem/i.test(match.text)));
  assert.ok(existingTools.some((match) => /integrate with your stack, your workflows, and your people/i.test(match.text)));
});

test('retrieves one related DEKODE discovery opportunity from relevant context', () => {
  const location = retrieveCompanyKnowledge('How do you work across Australia and India?');
  const delivery = retrieveCompanyKnowledge('How do you reduce project risk?');
  const product = retrieveCompanyKnowledge('We want to build a mobile app');

  assert.ok(location.some((match) => match.id === 'discovery-bridge'));
  assert.ok(delivery.some((match) => match.id === 'discovery-star'));
  assert.ok(product.some((match) => match.id === 'discovery-portfolio'));
});
