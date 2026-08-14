import { loadCompanyKnowledge } from '../../src/knowledge/companyKnowledgeLoader.js';

const knowledge = loadCompanyKnowledge();

const CASE_STUDY_QUERY = /\b(?:case stud(?:y|ies)|success stor(?:y|ies))\b/i;
const PORTFOLIO_QUERY = /\b(?:portfolio|past work|previous work|our work|your work|ur work|dekode(?:'s)? work|project examples|work examples)\b/i;
const PROJECT_CATALOGUE_QUERY = /^(?:show|share|list|see|what|which|tell me about|can i see|do you have|have you got)\b.*\b(?:projects|work|portfolio|examples)\b/i;
const PROJECT_BUILD_QUERY = /\b(?:build|create|make|develop|design|launch)\b.*\b(?:app|website|web app|platform|system|software|product|feature)\b/i;

export function detectEvidenceScope(question) {
  const normalized = String(question || '').trim().toLowerCase().replace(/\s+/g, ' ');
  if (!normalized || PROJECT_BUILD_QUERY.test(normalized)) return null;
  if (CASE_STUDY_QUERY.test(normalized)) return 'case_studies';
  if (PORTFOLIO_QUERY.test(normalized) || PROJECT_CATALOGUE_QUERY.test(normalized)) return 'portfolio';
  if (['projects', 'portfolio', 'case studies', 'success stories', 'our work'].includes(normalized)) {
    return normalized === 'case studies' || normalized === 'success stories' ? 'case_studies' : 'portfolio';
  }
  return null;
}

const caseStudyItem = (study) => ({
  id: study.id,
  name: study.name,
  kind: 'Published case study',
  imageKey: study.id,
  summary: study.solution,
  facts: [
    { label: 'Industry', value: study.industry },
    { label: 'Platform', value: study.platform },
  ],
  sections: [
    { label: 'Challenge', value: study.challenge },
    { label: 'Solution', value: study.solution },
    { label: 'Outcome', value: study.outcome },
  ],
});

const portfolioItem = (project) => ({
  id: project.id,
  name: project.name,
  kind: 'Verified portfolio project',
  imageKey: project.id,
  summary: project.description,
  facts: [
    { label: 'Category', value: project.category },
    { label: 'Platform', value: project.platform },
  ].filter((fact) => fact.value),
  sections: [
    { label: 'About', value: project.description },
    project.deliverables?.length
      ? { label: 'Delivered', value: project.deliverables.join(' | ') }
      : null,
    project.outcome ? { label: 'Outcome', value: project.outcome } : null,
  ].filter(Boolean),
});

export function buildEvidenceAccordion(question) {
  const scope = detectEvidenceScope(question);
  if (!scope) return null;

  const caseStudies = knowledge.caseStudies.map(caseStudyItem);
  const items = scope === 'case_studies'
    ? caseStudies
    : [...caseStudies, ...knowledge.portfolioProjects.map(portfolioItem)];

  return {
    scope,
    label: scope === 'case_studies' ? 'Published case studies' : 'Verified DEKODE work',
    items,
  };
}

export function evidenceIntroduction(scope) {
  return scope === 'case_studies'
    ? 'Yes. DEKODE has two published case studies. Select one to view its verified challenge, solution, platform, and outcome.'
    : "Here is DEKODE's verified public work. Select a project to view its approved details.";
}
