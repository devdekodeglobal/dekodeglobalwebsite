import companyKnowledge from '../../src/knowledge/companyKnowledge.json' with { type: 'json' };

const STOP_WORDS = new Set([
  'about', 'also', 'and', 'are', 'can', 'could', 'does', 'for', 'from', 'have',
  'how', 'into', 'our', 'that', 'the', 'their', 'this', 'what', 'when', 'where',
  'which', 'with', 'would', 'your', 'you', 'dekode',
]);

const normalise = (value) => String(value ?? '')
  .replace(/â€™/g, "'")
  .replace(/â€”/g, '-')
  .toLowerCase()
  .replace(/[^a-z0-9\s+-]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const tokenize = (value) => [...new Set(normalise(value).match(/[a-z0-9+-]{3,}/g) || [])]
  .filter((token) => !STOP_WORDS.has(token));

const joinItems = (items) => items.join(', ');

const PROJECT_EVIDENCE_ALIASES = [
  'projects', 'project', 'portfolio', 'past work', 'previous work', 'client work',
  'examples', 'case studies', 'success stories', 'clients', 'what have you built',
  'work done', 'your work', 'works done', 'what work', 'what have you done',
  'what did you build', 'what did you make', 'show me your work', 'built before',
  'built in the past', 'done before', 'done in the past', 'your projects', 'your clients',
];

const asksForProjectEvidence = (question) => {
  const query = normalise(question);
  if (/\b(methodology|delivery process|deliver projects?|how (?:do|does) .{0,16}work|project lifecycle)\b/.test(query)) return false;
  return /\b(projects?|portfolio|past work|previous work|client work|examples?|case studies|success stories|clients?|what have you built|work(?:s)? (?:done|have you done|did you do)|(?:show|see) (?:me )?(?:your )?work|what have you done|what did you (?:build|make|create|develop)|built (?:before|in the past)|done (?:before|in the past)|your (?:projects?|clients?|work))\b/.test(query);
};

const formatProject = (project) => [
  project.description,
  project.category && `Category: ${project.category}.`,
  project.type && `Type: ${project.type}.`,
  project.platform && `Platform: ${project.platform}.`,
  project.clientContext && `Client or context: ${project.clientContext}.`,
  project.deliverables?.length && `Deliverables: ${joinItems(project.deliverables)}.`,
  project.outcome && `Outcome: ${project.outcome}`,
].filter(Boolean).join('\n');

const formatCaseStudy = (study) => [
  `${study.name}\nKnown as: ${joinItems(study.aliases || [])}`,
  `Industry: ${study.industry}\nPlatform: ${study.platform}`,
  `Challenge: ${study.challenge}`,
  study.obstacles && `Obstacles: ${study.obstacles}`,
  `Solution: ${study.solution}`,
  study.deliveryApproach && `Delivery approach: ${study.deliveryApproach}`,
  `Outcome: ${study.outcome}`,
].filter(Boolean).join('\n');

function makeDocuments() {
  const bridge = companyKnowledge.initiatives?.find((initiative) => initiative.id === 'bridge');
  const documents = [
    {
      id: 'company-overview',
      label: 'About DEKODE',
      text: `${companyKnowledge.company.about}\nMission: ${companyKnowledge.company.mission}\nWhy DEKODE exists: ${companyKnowledge.company.origin}\nVision: ${companyKnowledge.company.vision}\nBelief: ${companyKnowledge.company.belief}`,
      aliases: [...(companyKnowledge.aliases.company || []), 'what does dekode do', 'what kind of company', 'about dekode'],
    },
    {
      id: 'service-catalogue',
      label: 'DEKODE services',
      text: `DEKODE services and offerings:\n${companyKnowledge.services
        .map((service) => `${service.name}: ${service.summary}`)
        .join('\n')}`,
    },
    {
      id: 'pricing',
      label: 'DEKODE pricing approach',
      text: 'DEKODE does not publish fixed pricing because scope depends on the problem, product, integrations, security, and support required. Accurate estimates are prepared after understanding the project.',
      aliases: ['pricing', 'price', 'prices', 'cost', 'costs', 'quote', 'estimate', 'fixed price', 'time and materials'],
    },
    {
      id: 'discovery-bridge',
      label: 'Related DEKODE initiative: BRIDGE',
      text: bridge ? bridge.title + '. ' + bridge.summary + ' Status: ' + bridge.status + '.' : '',
      aliases: ['Australia', 'India', 'cross-border', 'global delivery', 'location', 'locations', 'talent exchange', 'R&D collaboration'],
    },
    {
      id: 'discovery-star',
      label: 'Related DEKODE trust signal: STAR',
      text: 'DEKODE works through four STAR principles: Simple, Transparent, Accountable, and Reliable.',
      aliases: ['working style', 'delivery process', 'methodology', 'project risk', 'trust', 'why choose dekode'],
    },
    {
      id: 'discovery-portfolio',
      label: 'Related DEKODE public work',
      text: 'Verified portfolio examples include AttendMe, CHAUFFR, Smart Loan Helper, SmartBroker, Recycled Market, and Estrado. Published case studies cover Beston food manufacturing and Stella Maris Primary School.',
      aliases: ['website', 'mobile app', 'ecommerce', 'automation', 'internal system', 'cloud solution', 'similar work', 'relevant project'],
    },
    ...companyKnowledge.services.map((service) => ({
      id: `service-${service.id}`,
      label: service.name,
      text: `${service.name}: ${service.summary}\nCapabilities: ${joinItems(service.capabilities)}\nBest for: ${service.audience}`,
    })),
    ...companyKnowledge.solutionAreas.map((area) => {
      const service = companyKnowledge.services.find((item) => item.id === area.serviceId);
      return {
        id: `solution-${area.id}`,
        label: area.name,
        text: `${area.name}: ${area.summary}\nRelated DEKODE service: ${service?.name || 'DEKODE services'}.`,
      };
    }),
    ...(companyKnowledge.portfolioProjects || []).map((project) => ({
      id: `portfolio-${project.id}`,
      label: `${project.name} portfolio project`,
      text: formatProject(project),
      aliases: [project.name, ...(project.aliases || []), 'portfolio', 'project example', 'previous work'],
    })),
    {
      id: 'project-evidence-catalogue',
      label: 'DEKODE projects, portfolio, and case studies',
      text: `Verified DEKODE project evidence has two categories.\nPublished case studies:\n${companyKnowledge.caseStudies
        .map((study) => `${study.name} (${study.industry}, ${study.platform}): ${study.solution} Outcome: ${study.outcome}`)
        .join('\n')}\nPortfolio projects from the published old-site showcase:\n${(companyKnowledge.portfolioProjects || [])
        .map((project) => `${project.name} (${project.platform || project.type}): ${project.description}`)
        .join('\n')}`,
      aliases: PROJECT_EVIDENCE_ALIASES,
    },
    {
      id: 'company-leadership',
      label: 'DEKODE founder and leadership',
      text: `${companyKnowledge.company.leadership.founder.name} is DEKODE's ${companyKnowledge.company.leadership.founder.role}. LinkedIn: ${companyKnowledge.company.leadership.founder.linkedin}. The published source does not provide a longer founder biography.`,
      aliases: companyKnowledge.aliases.leadership,
    },
    ...(companyKnowledge.initiatives || []).map((initiative) => ({
      id: `initiative-${initiative.id}`,
      label: initiative.title,
      text: `${initiative.status}. ${initiative.summary}\n${initiative.regions.map((region) => `${region.name}: ${region.description}`).join('\n')}\nPillars: ${initiative.pillars.join(', ')}. Aliases: ${(initiative.aliases || []).join(', ')}.`,
      aliases: initiative.aliases || [],
    })),
    {
      id: 'industries',
      label: 'Industries',
      text: `DEKODE works with small and medium businesses in: ${joinItems(companyKnowledge.industries)}.`,
      aliases: companyKnowledge.aliases.industries,
    },
    {
      id: 'technology',
      label: 'Technology foundations',
      text: `Publicly named cloud platforms: ${joinItems(companyKnowledge.technologies)}. DEKODE selects technology around reliability, security, and maintainability.`,
      aliases: companyKnowledge.aliases.technologies,
    },
    {
      id: 'delivery-process',
      label: 'Delivery process',
      text: `DEKODE's six-stage delivery methodology. Security, privacy, and maintainability apply throughout.\n${companyKnowledge.developmentProcess
        .map((step) => `${step.name}: ${step.description}`)
        .join('\n')}`,
      aliases: companyKnowledge.aliases.process,
    },
    ...companyKnowledge.developmentProcess.map((step) => ({
      id: `process-${normalise(step.name).replace(/[^a-z0-9]+/g, '-')}`,
      label: `${step.name} delivery stage`,
      text: step.description,
      aliases: step.name === 'Discovery' ? ['discover', 'discovery'] : [step.name],
    })),
    {
      id: 'case-study-catalogue',
      label: 'DEKODE case studies',
      text: `Published DEKODE success stories:\n${companyKnowledge.caseStudies
        .map((study) => `${study.name} (${study.industry}): ${study.solution} Outcome: ${study.outcome}`)
        .join('\n')}`,
      aliases: ['case study', 'case studies', 'success story', 'success stories'],
    },
    ...companyKnowledge.caseStudies.map((study) => ({
      id: `case-study-${study.id}`,
      label: `${study.name} case study`,
      text: formatCaseStudy(study),
      aliases: [study.name, study.industry, ...(study.aliases || [])],
    })),
    {
      id: 'values',
      label: 'How DEKODE works',
      text: companyKnowledge.values
        .map((value) => `${value.name}: ${value.description}`)
        .join('\n'),
      aliases: [...(companyKnowledge.aliases.why || []), 'star', 'star principles'],
    },
    {
      id: 'contact',
      label: 'Contact',
      text: `Email: ${companyKnowledge.contact.email}. Phone numbers: ${joinItems(companyKnowledge.contact.phones)}. WhatsApp: +${companyKnowledge.contact.whatsapp}.`,
      aliases: companyKnowledge.aliases.contact,
    },
    {
      id: 'locations',
      label: 'DEKODE locations',
      text: `DEKODE office locations and addresses. ${companyKnowledge.contact.operatingModel}\n${companyKnowledge.contact.locations
        .map((location) => `${location.country}: ${location.address}`)
        .join('\n')}`,
      aliases: companyKnowledge.aliases.location,
    },
    {
      id: 'privacy-policy',
      label: companyKnowledge.legal.privacy.title,
      text: `${companyKnowledge.legal.privacy.summary}\nPrivacy contact: ${companyKnowledge.legal.privacy.contactEmail}.\n${companyKnowledge.legal.privacy.sections
        .map((section) => `${section.title}: ${section.summary}`)
        .join('\n')}`,
      aliases: companyKnowledge.aliases.privacy,
    },
    {
      id: 'terms-of-service',
      label: companyKnowledge.legal.terms.title,
      text: `${companyKnowledge.legal.terms.summary}\n${companyKnowledge.legal.terms.sections
        .map((section) => `${section.title}: ${section.summary}`)
        .join('\n')}`,
      aliases: companyKnowledge.aliases.terms,
    },
    ...companyKnowledge.faqs.map((faq, index) => ({
      id: `faq-${index + 1}`,
      label: 'FAQ',
      text: `Question: ${faq.question}\nAnswer: ${faq.answer}`,
    })),
  ];

  return documents.map((document) => ({
    ...document,
    aliases: document.aliases || [],
    terms: tokenize(`${document.label} ${document.text} ${(document.aliases || []).join(' ')}`),
  }));
}

const documents = makeDocuments();

export function retrieveCompanyKnowledge(question, limit = 5) {
  const queryTerms = tokenize(question);
  const query = normalise(question);
  const projectEvidenceQuery = asksForProjectEvidence(query);
  const asksAboutCompany = /\b(?:dekode|company|business)\b/.test(query)
    && /\b(?:about|do|does|what|kind|company|work|provide|offer)\b/.test(query);
  const asksAboutServices = /\b(?:services?|offerings?|capabilities|what (?:do|does) dekode (?:do|offer|provide))\b/.test(query);
  const asksAboutDelivery = /\b(?:methodology|delivery process|deliver projects?|project lifecycle|how does dekode (?:deliver|work))\b/.test(query);
  const asksAboutBridge = /\b(?:what is bridge|bridge initiative|dekode bridge)\b/.test(query);
  const asksAboutLeadership = /\b(?:founder|founded|owner|leadership|who (?:started|founded|runs|is behind)|pankaj banga)\b/.test(query);

  const ranked = documents
    .map((document) => {
      const overlap = queryTerms.filter((term) => document.terms.includes(term)).length;
      const nameBonus = query.includes(normalise(document.label)) ? 3 : 0;
      const aliasBonus = document.aliases.some((alias) => query.includes(normalise(alias))) ? 3 : 0;
      const catalogueBonus = projectEvidenceQuery && document.id === 'project-evidence-catalogue' ? 6 : 0;
      const evidenceBonus = projectEvidenceQuery && /^(?:portfolio-|case-study-)/.test(document.id) ? 2 : 0;
      const overviewPenalty = projectEvidenceQuery && document.id === 'company-overview' ? 8 : 0;
      const companyOverviewBonus = asksAboutCompany && document.id === 'company-overview' ? 8 : 0;
      const faqOverviewBonus = asksAboutCompany && document.id === 'faq-1' ? 5 : 0;
      const serviceCatalogueBonus = asksAboutServices && document.id === 'service-catalogue' ? 8 : 0;
      const deliveryProcessBonus = asksAboutDelivery && document.id === 'delivery-process' ? 8 : 0;
      const bridgeInitiativeBonus = asksAboutBridge && document.id === 'initiative-bridge' ? 8 : 0;
      const leadershipBonus = asksAboutLeadership && document.id === 'company-leadership' ? 10 : 0;
      const leadershipOverviewPenalty = asksAboutLeadership && document.id === 'company-overview' ? 5 : 0;
      const discoveryPenalty = document.id.startsWith('discovery-') ? 2 : 0;
      return {
        ...document,
        score: overlap + nameBonus + aliasBonus + catalogueBonus + evidenceBonus
          + companyOverviewBonus + faqOverviewBonus + serviceCatalogueBonus
          + deliveryProcessBonus + bridgeInitiativeBonus + leadershipBonus
          - overviewPenalty - leadershipOverviewPenalty - discoveryPenalty,
      };
    })
    .filter((document) => document.score > 0)
    .sort((left, right) => right.score - left.score || left.text.length - right.text.length)
    .slice(0, limit);

  return ranked.map(({ id, label, text }) => ({ id, label, text }));
}

export function formatKnowledgeContext(question) {
  const matches = retrieveCompanyKnowledge(question);
  if (!matches.length) return { matches, context: 'No directly relevant public DEKODE knowledge was found.' };

  const context = matches
    .map((match) => `[${match.label}]\n${match.text}`)
    .join('\n\n')
    .slice(0, 7000);
  return { matches, context };
}
