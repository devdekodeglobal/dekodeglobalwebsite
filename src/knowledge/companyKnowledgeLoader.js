import companyKnowledge from './companyKnowledge.json' assert { type: 'json' };

let cachedKnowledge;

export function loadCompanyKnowledge() {
  if (!cachedKnowledge) cachedKnowledge = Object.freeze(companyKnowledge);
  return cachedKnowledge;
}
