import { loadCompanyKnowledge } from '../../src/knowledge/companyKnowledgeLoader.js';

const knowledge = loadCompanyKnowledge();

const CASE_STUDY_QUERY = /\b(?:case stud(?:y|ies)|success stor(?:y|ies))\b/i;
const PORTFOLIO_QUERY = /\b(?:portfolio|past work|previous work|our work|your work|ur work|dekode['’]s work|project examples|work examples|testimonials?|reviews?)\b/i;
const PROJECT_CATALOGUE_QUERY = /^(?:show|share|list|see|what|which|tell me about|can i see|do you have|have you got)\b.*\b(?:projects|work|portfolio|examples)\b/i;
const PROJECT_BUILD_QUERY = /\b(?:build|create|make|develop|design|launch)\b.*\b(?:app|website|web app|platform|system|software|product|feature)\b/i;
const DELIVERY_PROCESS_QUERY = /\b(?:methodology|delivery process|project lifecycle|how (?:do|does) (?:dekode|your team|you) (?:work|deliver|run projects?))\b/i;

const normalizeForMatch = (value) => String(value || '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()
  .replace(/\s+/g, ' ');

export function detectEvidenceScope(question) {
  const normalized = String(question || '').trim().toLowerCase().replace(/\s+/g, ' ');
  if (!normalized || PROJECT_BUILD_QUERY.test(normalized) || DELIVERY_PROCESS_QUERY.test(normalized)) return null;
  if (/\b(?:domain|industry|industries|sector)s?\b/i.test(normalized) && !/\b(?:projects?|case stud(?:y|ies))\b/i.test(normalized)) return null;
  if (CASE_STUDY_QUERY.test(normalized)) return 'case_studies';
  if (PORTFOLIO_QUERY.test(normalized) || PROJECT_CATALOGUE_QUERY.test(normalized)) return 'portfolio';
  if (['projects', 'portfolio', 'case studies', 'success stories', 'our work', 'testimonials', 'testimonial', 'reviews', 'review'].includes(normalized)) {
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
  kind: 'Portfolio project',
  imageKey: project.id,
  summary: project.description,
  facts: [
    { label: 'Category', value: project.category },
    { label: 'Platform', value: project.platform },
  ].filter((fact) => fact.value),
  sections: [
    { label: 'About', value: project.description },
    project.deliverables?.length
      ? { label: 'Delivered', value: project.deliverables.join('; ') }
      : null,
    project.outcome ? { label: 'Outcome', value: project.outcome } : null,
  ].filter(Boolean),
});

function findSpecificEvidence(question) {
  const normalized = normalizeForMatch(question);
  if (!normalized || PROJECT_BUILD_QUERY.test(normalized)) return null;

  const namedProject = knowledge.portfolioProjects.find((project) =>
    normalized.includes(normalizeForMatch(project.name))
  );
  if (namedProject) return portfolioItem(namedProject);

  const caseStudyAliases = {
    'food-manufacturing': ['food manufacturer', 'food manufacturing company', 'food manufacturing case study'],
    'primary-school': ['primary school case study', 'primary school solution'],
  };
  const namedStudy = knowledge.caseStudies.find((study) =>
    caseStudyAliases[study.id]?.some((alias) => normalized.includes(alias))
  );
  return namedStudy ? caseStudyItem(namedStudy) : null;
}

export function buildEvidenceAccordion(question, evidenceProjects, useFallbackRegex = true) {
  // If Gemini explicitly selected specific projects, filter by those
  if (Array.isArray(evidenceProjects) && evidenceProjects.length > 0) {
    const normalizedSelected = evidenceProjects.map(normalizeForMatch);
    const allItems = [
      ...knowledge.caseStudies.map(caseStudyItem),
      ...knowledge.portfolioProjects.map(portfolioItem),
    ];
    const filteredItems = allItems.filter((item) =>
      normalizedSelected.some(
        (selectedName) =>
          normalizeForMatch(item.name).includes(selectedName) ||
          selectedName.includes(normalizeForMatch(item.name))
      )
    );

    if (filteredItems.length === 1) {
      return {
        scope: 'specific',
        mode: 'specific',
        label: filteredItems[0].kind,
        autoOpen: true,
        items: filteredItems,
      };
    } else if (filteredItems.length > 0) {
      // Always include all published case studies when showing a broad catalogue
      const caseStudyItems = knowledge.caseStudies.map(caseStudyItem);
      const uniquePortfolioItems = filteredItems.filter((item) => item.kind !== 'Published case study');
      const finalItems = [...caseStudyItems, ...uniquePortfolioItems];

      return {
        scope: 'portfolio',
        mode: 'catalogue',
        label: 'DEKODE work',
        items: finalItems,
      };
    }
  }
  
  if (!useFallbackRegex) return null;

  const specificItem = findSpecificEvidence(question);
  if (specificItem) {
    return {
      scope: 'specific',
      mode: 'specific',
      label: specificItem.kind,
      autoOpen: true,
      items: [specificItem],
    };
  }

  const scope = detectEvidenceScope(question);
  if (!scope) return null;

  const caseStudies = knowledge.caseStudies.map(caseStudyItem);
  const items = scope === 'case_studies'
    ? caseStudies
    : [...caseStudies, ...knowledge.portfolioProjects.map(portfolioItem)];

  return {
    scope,
    mode: 'catalogue',
    label: scope === 'case_studies' ? 'Published case studies' : 'DEKODE work',
    items,
  };
}
