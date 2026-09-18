import companyKnowledge from './companyKnowledge.json';

let cachedKnowledge;

export function loadCompanyKnowledge() {
  if (!cachedKnowledge) cachedKnowledge = Object.freeze(companyKnowledge);
  return cachedKnowledge;
}
