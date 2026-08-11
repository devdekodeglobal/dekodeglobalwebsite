import { loadCompanyKnowledge } from './companyKnowledgeLoader.js';
import { normalizeVisitorMessage as normalise } from './messageNormalization.js';

const knowledge = loadCompanyKnowledge();

const findSolutionArea = (message) => {
  const input = normalise(message);
  return knowledge.solutionAreas.find((area) => {
    const terms = [area.name, ...(area.aliases || [])].map(normalise);
    return terms.some((term) => term.length > 3 && input.includes(term));
  });
};

const findPortfolioProject = (message) => {
  const input = normalise(message);
  return (knowledge.portfolioProjects || []).find((project) =>
    input.includes(normalise(project.name)),
  );
};

const findCaseStudy = (message) => {
  const input = normalise(message);
  return (knowledge.caseStudies || []).find((study) =>
    [study.name, study.id.replaceAll('-', ' '), ...(study.aliases || [])]
      .map(normalise)
      .some((term) => term && input.includes(term)),
  );
};

const findInitiative = (message) => {
  const input = normalise(message);
  return (knowledge.initiatives || []).find((initiative) =>
    [initiative.name, initiative.title, ...(initiative.aliases || [])]
      .map(normalise)
      .some((term) => term && input.includes(term)),
  );
};

const findDevelopmentStep = (message) => {
  const input = normalise(message);
  return (knowledge.developmentProcess || []).find((step) => {
    const name = normalise(step.name);
    const terms = name === 'discover' ? ['discover', 'discovery'] : [name];
    return terms.some((term) => new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(input));
  });
};

const topicTerms = Object.fromEntries(
  Object.entries(knowledge.aliases).map(([topic, aliases]) => [
    topic,
    [topic, ...aliases].map(normalise),
  ]),
);

export function findTopic(message) {
  const input = normalise(message);
  let best = { topic: null, score: 0 };

  for (const [topic, terms] of Object.entries(topicTerms)) {
    const score = terms.reduce((total, term) => total + (input.includes(term) ? term.split(' ').length : 0), 0);
    const replacesGenericCompanyTie = score === best.score && best.topic === 'company' && topic !== 'company';
    if (score > best.score || replacesGenericCompanyTie) best = { topic, score };
  }

  const service = knowledge.services.find((item) => {
    const terms = [item.name, ...item.capabilities].map(normalise);
    return terms.some((term) => term.length > 3 && input.includes(term));
  });
  const solutionArea = findSolutionArea(message);
  const portfolioProject = findPortfolioProject(message);
  const caseStudy = findCaseStudy(message);
  const initiative = findInitiative(message);
  const developmentStep = findDevelopmentStep(message);

  if (portfolioProject) {
    return { topic: 'caseStudies', service, solutionArea, portfolioProject, caseStudy, initiative, developmentStep };
  }
  if (caseStudy) {
    return { topic: 'caseStudies', service, solutionArea, portfolioProject, caseStudy, initiative, developmentStep };
  }
  if (initiative) {
    return { topic: 'initiatives', service, solutionArea, portfolioProject, caseStudy, initiative, developmentStep };
  }
  if (developmentStep) {
    return { topic: 'process', service, solutionArea, portfolioProject, caseStudy, initiative, developmentStep };
  }

  if ((service || solutionArea) && (!best.topic || best.score <= 1)) {
    return { topic: 'services', service, solutionArea };
  }
  return { ...best, service, solutionArea, portfolioProject, caseStudy, initiative, developmentStep };
}

export function findNamedOffering(message) {
  const input = normalise(message);
  return knowledge.services.find((service) => {
    const significantWords = normalise(service.name)
      .split(' ')
      .filter((word) => word.length > 3 && !['development', 'consulting'].includes(word));
    return significantWords.some((word) => input.includes(word));
  });
}

export { findSolutionArea };
export { findPortfolioProject };
export { findCaseStudy, findInitiative, findDevelopmentStep };
