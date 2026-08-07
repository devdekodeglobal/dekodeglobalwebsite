import fs from 'node:fs/promises';
import cases from './evaluation-cases.json' with { type: 'json' };
import { retrieveLexical } from './retrieval.js';

const serviceUrl = String(process.env.SERVICE_URL || '').replace(/\/$/, '');
const authToken = process.env.AUTH_TOKEN;
const selectedCaseIds = new Set(String(process.env.CASE_IDS || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean));
const selectedCases = selectedCaseIds.size
  ? cases.filter((testCase) => selectedCaseIds.has(testCase.id))
  : cases;
const reportName = selectedCaseIds.size ? 'evaluation-smoke-report' : 'evaluation-report';

if (selectedCaseIds.size && selectedCases.length !== selectedCaseIds.size) {
  const foundIds = new Set(selectedCases.map((testCase) => testCase.id));
  const missingIds = [...selectedCaseIds].filter((id) => !foundIds.has(id));
  throw new Error(`Unknown evaluation case IDs: ${missingIds.join(', ')}`);
}

function sourceMatches(testCase, sourceIds) {
  if (testCase.expected === 'refuse') return sourceIds.length === 0;
  const exact = (testCase.sourceIds || []).some((id) => sourceIds.includes(id));
  const prefix = (testCase.sourcePrefixes || []).some((value) => sourceIds.some((id) => id.startsWith(value)));
  return exact || prefix;
}

async function cloudRetrieve(question) {
  if (!serviceUrl || !authToken) return null;
  const response = await fetch(`${serviceUrl}/evaluation/retrieve`, {
    method: 'POST',
    headers: { authorization: `Bearer ${authToken}`, 'content-type': 'application/json' },
    body: JSON.stringify({ question }),
  });
  if (!response.ok) throw new Error(`Cloud retrieval failed with HTTP ${response.status}`);
  return response.json();
}

const results = [];
for (const testCase of selectedCases) {
  const lexicalIds = retrieveLexical(testCase.question, 5).map((match) => match.id);
  const cloud = await cloudRetrieve(testCase.question);
  const hybridIds = cloud?.matches?.map((match) => match.id) || [];
  results.push({
    id: testCase.id,
    question: testCase.question,
    expected: testCase.expected,
    lexicalIds,
    lexicalPass: sourceMatches(testCase, lexicalIds),
    hybridIds: cloud ? hybridIds : undefined,
    hybridPass: cloud ? sourceMatches(testCase, hybridIds) : undefined,
    retrievalMode: cloud?.retrievalMode,
  });
}

const metric = (key) => {
  const measured = results.filter((item) => typeof item[key] === 'boolean');
  const passed = measured.filter((item) => item[key]).length;
  return { passed, total: measured.length, rate: measured.length ? passed / measured.length : null };
};

const report = {
  generatedAt: new Date().toISOString(),
  cases: selectedCases.length,
  lexical: metric('lexicalPass'),
  hybrid: metric('hybridPass'),
  results,
};

await fs.writeFile(`${reportName}.json`, `${JSON.stringify(report, null, 2)}\n`);
const percent = (value) => value == null ? 'not run' : `${(value * 100).toFixed(1)}%`;
const markdown = [
  '# DEKODE Retrieval Evaluation',
  '',
  `Generated: ${report.generatedAt}`,
  '',
  `- Cases: ${report.cases}`,
  `- Lexical pass rate: ${percent(report.lexical.rate)} (${report.lexical.passed}/${report.lexical.total})`,
  `- Hybrid pass rate: ${percent(report.hybrid.rate)}${report.hybrid.total ? ` (${report.hybrid.passed}/${report.hybrid.total})` : ''}`,
  '',
  '| Case | Expected | Lexical | Hybrid | Top hybrid sources |',
  '| --- | --- | --- | --- | --- |',
  ...results.map((item) => `| ${item.id} | ${item.expected} | ${item.lexicalPass ? 'PASS' : 'FAIL'} | ${item.hybridPass == null ? '-' : item.hybridPass ? 'PASS' : 'FAIL'} | ${(item.hybridIds || []).join(', ')} |`),
  '',
].join('\n');
await fs.writeFile(`${reportName}.md`, markdown);
console.log(JSON.stringify(report, null, 2));
