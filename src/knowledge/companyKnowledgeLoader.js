import companyKnowledge from './companyKnowledgeData.js';

let cachedKnowledge;

export function loadCompanyKnowledge() {
  if (!cachedKnowledge) cachedKnowledge = Object.freeze(companyKnowledge);
  return cachedKnowledge;
}
