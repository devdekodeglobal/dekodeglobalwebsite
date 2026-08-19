import companyKnowledge from './companyKnowledge.json' with { type: 'json' };
import { createHash } from 'node:crypto';

const STOP_WORDS = new Set([
  'a', 'about', 'also', 'an', 'and', 'are', 'as', 'at', 'be', 'can', 'could',
  'do', 'does', 'for', 'from', 'have', 'how', 'i', 'in', 'into', 'is', 'it',
  'me', 'my', 'of', 'on', 'our', 'that', 'the', 'their', 'this', 'to', 'what',
  'when', 'where', 'which', 'with', 'would', 'your', 'you', 'dekode',
]);

const join = (items = []) => items.filter(Boolean).join(', ');

const PROJECT_EVIDENCE_ALIASES = [
  'projects', 'project', 'portfolio', 'past work', 'previous work', 'client work',
  'examples', 'case studies', 'success stories', 'clients', 'what have you built',
];

const asksForProjectEvidence = (question) => {
  const query = normalize(question);
  if (/\b(methodology|delivery process|deliver projects?|how (?:do|does) .{0,16}work|project lifecycle)\b/.test(query)) return false;
  return /\b(projects?|portfolio|past work|previous work|client work|examples?|case studies|success stories|clients?|what have you built)\b/.test(query);
};

const asksAboutDelivery = (question) => /\b(?:methodology|delivery process|deliver projects?|project lifecycle|how (?:do|does) (?:dekode|your team|you) (?:work|deliver|run projects?))\b/.test(normalize(question));

const formatProject = (project) => [
  project.description,
  project.category && `Category: ${project.category}.`,
  project.type && `Type: ${project.type}.`,
  project.platform && `Platform: ${project.platform}.`,
  project.clientContext && `Client or context: ${project.clientContext}.`,
  project.deliverables?.length && `Deliverables: ${join(project.deliverables)}.`,
  project.outcome && `Outcome: ${project.outcome}`,
].filter(Boolean).join('\n');

const formatCaseStudy = (study) => [
  `Known as: ${join(study.aliases)}. Industry: ${study.industry}. Platform: ${study.platform}.`,
  `Challenge: ${study.challenge}`,
  study.obstacles && `Obstacles: ${study.obstacles}`,
  `Solution: ${study.solution}`,
  study.deliveryApproach && `Delivery approach: ${study.deliveryApproach}`,
  `Outcome: ${study.outcome}`,
].filter(Boolean).join('\n');

export const normalize = (value) => String(value ?? '')
  .toLowerCase()
  .replace(/\bbookameeting\b/g, 'book a meeting')
  .replace(/\bameeting\b/g, 'a meeting')
  .replace(/\b(?:metting|meating|meetng)\b/g, 'meeting')
  .replace(/\bcalanders?\b|\bcalenders?\b/g, 'calendar')
  .replace(/\bscheduals?\b/g, 'schedule')
  .replace(/\bbussiness(?:es)?\b/g, 'business')
  .replace(/\bautomashun\b/g, 'automation')
  .replace(/\bmordern(?:ise|ize)?\b/g, 'modernise')
  .replace(/\battendence\b/g, 'attendance')
  .replace(/\bmob\s+apps?\b/g, 'mobile app')
  .replace(/\be[\s-]?comm?erce\b/g, 'ecommerce')
  .replace(/\bu\b/g, 'you')
  .replace(/[^a-z0-9\s+&-]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

export const tokenize = (value) => [...new Set(normalize(value).match(/[a-z0-9+&-]{2,}/g) || [])]
  .filter((token) => !STOP_WORDS.has(token));

function createDocument(id, label, text, aliases = []) {
  const searchText = `${label}\n${text}\n${aliases.join(' ')}`;
  return { id, label, text, aliases, terms: tokenize(searchText) };
}

export function buildDocuments() {
  const bridge = companyKnowledge.initiatives?.find((initiative) => initiative.id === 'bridge');
  const documents = [
    createDocument('company-about', 'About DEKODE', [
      companyKnowledge.company?.about,
      `Origin: ${companyKnowledge.company?.origin}`,
      `Mission: ${companyKnowledge.company?.mission}`,
      `Vision: ${companyKnowledge.company?.vision}`,
      `Belief: ${companyKnowledge.company?.belief}`,
    ].filter(Boolean).join('\n'), [...(companyKnowledge.aliases?.company || []), 'what does dekode do', 'what kind of company', 'about dekode']),
    createDocument('company-values', 'Why choose DEKODE', [
      ...(companyKnowledge.whyChooseUs || []).map((item) => `${item.name}: ${item.description}`),
      ...(companyKnowledge.values || []).map((item) => `${item.name}: ${item.description}`),
    ].join('\n'), [...(companyKnowledge.aliases?.why || []), 'star', 'star principles']),
    createDocument('company-leadership', 'DEKODE founder and leadership',
      `${companyKnowledge.company.leadership.founder.name} is DEKODE's ${companyKnowledge.company.leadership.founder.role}. LinkedIn: ${companyKnowledge.company.leadership.founder.linkedin}. The published source does not provide a longer founder biography.`,
      companyKnowledge.aliases?.leadership),
    createDocument('industries', 'Industries DEKODE serves',
      `DEKODE works with businesses in ${join(companyKnowledge.industries)}.`,
      companyKnowledge.aliases?.industries),
    createDocument('technologies', 'Technology platforms',
      `DEKODE works across ${join(companyKnowledge.technologies)}.`,
      companyKnowledge.aliases?.technologies),
    createDocument('contact', 'Contact DEKODE', [
      `Email: ${companyKnowledge.contact?.email}`,
      `Phone: ${join(companyKnowledge.contact?.phoneLabels || companyKnowledge.contact?.phones)}`,
      `WhatsApp: ${companyKnowledge.contact?.whatsapp}`,
      'Visitors can contact DEKODE or request a discovery call through the website meeting-booking experience.',
    ].join('\n'), [...(companyKnowledge.aliases?.contact || []), 'book a meeting', 'schedule a call', 'discovery call']),
    createDocument('locations', 'DEKODE locations', [
      ...(companyKnowledge.contact?.locations || []).map((location) => `${location.country}: ${location.address}`),
      companyKnowledge.contact?.operatingModel,
    ].filter(Boolean).join('\n'), companyKnowledge.aliases?.location),
    createDocument('pricing', 'DEKODE pricing approach',
      'DEKODE does not publish fixed pricing because scope depends on the problem, product, integrations, security, and support required. Accurate estimates are prepared after understanding the project.',
      ['pricing', 'price', 'prices', 'cost', 'costs', 'quote', 'estimate', 'fixed price', 'time and materials']),
    createDocument('discovery-bridge', 'Related DEKODE initiative: BRIDGE',
      bridge ? bridge.title + '. ' + bridge.summary + ' Status: ' + bridge.status + '.' : '',
      ['Australia', 'India', 'cross-border', 'global delivery', 'location', 'locations', 'talent exchange', 'R&D collaboration']),
    createDocument('discovery-star', 'Related DEKODE trust signal: STAR',
      'DEKODE works through four STAR principles: Simple, Transparent, Accountable, and Reliable.',
      ['working style', 'delivery process', 'methodology', 'project risk', 'trust', 'why choose dekode']),
    createDocument('discovery-portfolio', 'Related DEKODE work',
      'Portfolio examples include AttendMe, CHAUFFR, Smart Loan Helper, SmartBroker, Recycled Market, and Estrado. Published case studies cover Food manufacturer food manufacturing and Primary School.',
      ['website', 'mobile app', 'ecommerce', 'automation', 'internal system', 'cloud solution', 'similar work', 'relevant project']),
  ];

  for (const service of companyKnowledge.services || []) {
    documents.push(createDocument(
      `service-${service.id}`,
      service.name,
      `${service.summary}\nCapabilities: ${join(service.capabilities)}\nBest suited for: ${service.audience}`,
      companyKnowledge.aliases?.services,
    ));
  }

  for (const area of companyKnowledge.solutionAreas || []) {
    documents.push(createDocument(`solution-${area.id}`, area.name, area.summary, [area.name]));
  }

  documents.push(createDocument(
    'process-overview',
    'DEKODE delivery process',
    `DEKODE takes projects from idea to ongoing improvement through six connected stages. Security, privacy, and maintainability apply throughout:\n${(companyKnowledge.developmentProcess || [])
      .map((step) => `${step.name}: ${step.description}`)
      .join('\n')}`,
    companyKnowledge.aliases?.process,
  ));

  for (const step of companyKnowledge.developmentProcess || []) {
    const stepAliases = step.name === 'Discovery' ? ['discover', 'discovery'] : [step.name];
    documents.push(createDocument(
      `process-${normalize(step.name).replace(/[^a-z0-9]+/g, '-')}`,
      `${step.name} delivery stage`,
      step.description,
      stepAliases,
    ));
  }

  for (const study of companyKnowledge.caseStudies || []) {
    documents.push(createDocument(
      `case-${study.id}`,
      `${study.name} case study`,
      formatCaseStudy(study),
      [study.name, study.industry, ...(study.aliases || [])],
    ));
  }

  for (const initiative of companyKnowledge.initiatives || []) {
    documents.push(createDocument(
      `initiative-${initiative.id}`,
      initiative.title,
      `${initiative.status}. ${initiative.summary}\n${initiative.regions.map((region) => `${region.name}: ${region.description}`).join('\n')}\nPillars: ${join(initiative.pillars)}.`,
      [...(companyKnowledge.aliases?.initiatives || []), ...(initiative.aliases || [])],
    ));
  }

  for (const project of companyKnowledge.portfolioProjects || []) {
    documents.push(createDocument(
      `portfolio-${project.id}`,
      `${project.name} portfolio project`,
      formatProject(project),
      [project.name, ...(project.aliases || []), 'portfolio', 'project example', 'previous work'],
    ));
  }

  documents.push(createDocument(
    'project-evidence-catalogue',
    'DEKODE projects, portfolio, and case studies',
    `Verified DEKODE project evidence has two categories.\nPublished case studies:\n${(companyKnowledge.caseStudies || [])
      .map((study) => `${study.name} (${study.industry}, ${study.platform}): ${study.solution} Outcome: ${study.outcome}`)
      .join('\n')}\nPortfolio projects from the published old-site showcase:\n${(companyKnowledge.portfolioProjects || [])
      .map((project) => `${project.name} (${project.platform || project.type}): ${project.description}`)
      .join('\n')}`,
    PROJECT_EVIDENCE_ALIASES,
  ));

  for (const [key, policy] of Object.entries(companyKnowledge.legal || {})) {
    documents.push(createDocument(
      `legal-${key}`,
      policy.title,
      [policy.summary, ...(policy.sections || []).map((section) => `${section.title}: ${section.summary}`)].join('\n'),
      companyKnowledge.aliases?.[key],
    ));
  }

  for (const [index, faq] of (companyKnowledge.faqs || []).entries()) {
    documents.push(createDocument(`faq-${index + 1}`, faq.question, faq.answer));
  }

  return documents;
}

export const documents = buildDocuments();

export function documentDigest(items = documents) {
  const source = items.map(({ id, label, text }) => ({ id, label, text }));
  return createHash('sha256').update(JSON.stringify(source)).digest('hex');
}

function lexicalScore(question, document) {
  const query = normalize(question);
  const queryTerms = tokenize(question);
  if (!queryTerms.length) return 0;

  const matchedTerms = queryTerms.filter((term) => document.terms.includes(term)).length;
  const coverage = matchedTerms / queryTerms.length;
  const phraseBoost = document.aliases.some((alias) => query.includes(normalize(alias))) ? 0.35 : 0;
  const labelBoost = query.includes(normalize(document.label)) ? 0.25 : 0;
  const projectEvidenceQuery = asksForProjectEvidence(query);
  const deliveryQuery = asksAboutDelivery(query);
  const catalogueBoost = document.id === 'project-evidence-catalogue' && projectEvidenceQuery
    ? 0.55
    : 0;
  const evidenceBoost = projectEvidenceQuery && /^(?:portfolio-|case-)/.test(document.id) ? 0.2 : 0;
  const overviewPenalty = projectEvidenceQuery && document.id === 'company-about' ? 0.8 : 0;
  const deliveryBoost = deliveryQuery && document.id === 'process-overview' ? 0.9 : 0;
  const deliveryOverviewPenalty = deliveryQuery && document.id === 'company-about' ? 0.65 : 0;
  const leadershipQuery = /\b(?:founder|founded|owner|leadership|who (?:started|founded|runs|is behind)|pankaj banga)\b/.test(query);
  const leadershipBoost = leadershipQuery && document.id === 'company-leadership' ? 0.75 : 0;
  const leadershipOverviewPenalty = leadershipQuery && document.id === 'company-about' ? 0.45 : 0;
  return Math.max(0, Math.min(1.75, coverage * 0.7 + phraseBoost + labelBoost + catalogueBoost
    + evidenceBoost + deliveryBoost + leadershipBoost
    - overviewPenalty - deliveryOverviewPenalty - leadershipOverviewPenalty));
}

export function retrieveLexical(question, limit = 5) {
  return documents
    .map((document) => ({ ...document, lexicalScore: lexicalScore(question, document) }))
    .filter((document) => document.lexicalScore > 0)
    .sort((left, right) => right.lexicalScore - left.lexicalScore)
    .slice(0, limit);
}

function dotProduct(left, right) {
  let total = 0;
  for (let index = 0; index < Math.min(left.length, right.length); index += 1) {
    total += left[index] * right[index];
  }
  return total;
}

export function createHybridRetriever({
  embed,
  embedMany,
  precomputedIndex,
  semanticThreshold = 0.55,
  batchSize = 5,
}) {
  let documentEmbeddingsPromise;

  const getDocumentEmbeddings = () => {
    documentEmbeddingsPromise ||= (async () => {
      if (precomputedIndex) {
        if (precomputedIndex.documentDigest !== documentDigest()) {
          throw new Error('PRECOMPUTED_INDEX_CORPUS_MISMATCH');
        }
        const vectors = new Map((precomputedIndex.vectors || [])
          .map((item) => [item.id, item.values]));
        const missingDocuments = documents.filter((document) => !Array.isArray(vectors.get(document.id)));
        for (let offset = 0; offset < missingDocuments.length; offset += batchSize) {
          const batch = missingDocuments.slice(offset, offset + batchSize);
          const contents = batch.map((document) => `${document.label}\n${document.text}`);
          const missingVectors = embedMany
            ? await embedMany(contents, 'RETRIEVAL_DOCUMENT')
            : await Promise.all(contents.map((content) => embed(content, 'RETRIEVAL_DOCUMENT')));
          batch.forEach((document, index) => vectors.set(document.id, missingVectors[index]));
        }
        return documents.map((document) => ({ id: document.id, vector: vectors.get(document.id) }));
      }

      const indexedDocuments = [];
      for (let offset = 0; offset < documents.length; offset += batchSize) {
        const batch = documents.slice(offset, offset + batchSize);
        const contents = batch.map((document) => `${document.label}\n${document.text}`);
        const vectors = embedMany
          ? await embedMany(contents, 'RETRIEVAL_DOCUMENT')
          : await Promise.all(contents.map((content) => embed(content, 'RETRIEVAL_DOCUMENT')));
        for (let index = 0; index < batch.length; index += 1) {
          indexedDocuments.push({ id: batch[index].id, vector: vectors[index] });
        }
      }
      return indexedDocuments;
    })().catch((error) => {
      documentEmbeddingsPromise = undefined;
      throw error;
    });
    return documentEmbeddingsPromise;
  };

  return async function retrieveHybrid(question, limit = 5) {
    const lexical = new Map(retrieveLexical(question, documents.length)
      .map((match) => [match.id, match.lexicalScore]));
    const projectEvidenceQuery = asksForProjectEvidence(question);
    const deliveryQuery = asksAboutDelivery(question);
    const leadershipQuery = /\b(?:founder|founded|owner|leadership|who (?:started|founded|runs|is behind)|pankaj banga)\b/.test(normalize(question));

    try {
      const indexedDocuments = await getDocumentEmbeddings();
      const queryVector = await embed(question, 'RETRIEVAL_QUERY');
      const vectors = new Map(indexedDocuments.map((item) => [item.id, item.vector]));
      const ranked = documents.map((document) => {
        const semanticScore = dotProduct(queryVector, vectors.get(document.id));
        const exactScore = lexical.get(document.id) || 0;
        const catalogueBoost = projectEvidenceQuery && document.id === 'project-evidence-catalogue' ? 0.5 : 0;
        const evidenceBoost = projectEvidenceQuery && /^(?:portfolio-|case-)/.test(document.id) ? 0.15 : 0;
        const overviewPenalty = projectEvidenceQuery && document.id === 'company-about' ? 0.5 : 0;
        const deliveryBoost = deliveryQuery && document.id === 'process-overview' ? 0.55 : 0;
        const deliveryOverviewPenalty = deliveryQuery && document.id === 'company-about' ? 0.4 : 0;
        const leadershipBoost = leadershipQuery && document.id === 'company-leadership' ? 0.45 : 0;
        const leadershipOverviewPenalty = leadershipQuery && document.id === 'company-about' ? 0.3 : 0;
        return {
          ...document,
          semanticScore,
          lexicalScore: exactScore,
          score: semanticScore * 0.82 + exactScore * 0.18 + catalogueBoost + evidenceBoost
            + deliveryBoost + leadershipBoost
            - overviewPenalty - deliveryOverviewPenalty - leadershipOverviewPenalty,
          retrievalMode: 'hybrid',
        };
      }).sort((left, right) => right.score - left.score);

      const bestSemanticScore = ranked[0]?.semanticScore || 0;
      if (bestSemanticScore < semanticThreshold && !ranked.some((item) => item.lexicalScore >= 0.55)) {
        return [];
      }
      return ranked
        .filter((item) => item.semanticScore >= semanticThreshold || item.lexicalScore >= 0.55)
        .slice(0, limit);
    } catch (error) {
      console.warn('Semantic retrieval unavailable; using lexical fallback:', error.message);
      return retrieveLexical(question, limit).map((match) => ({
        ...match,
        score: match.lexicalScore,
        retrievalMode: 'lexical-fallback',
      }));
    }
  };
}
