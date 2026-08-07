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

function makeDocuments() {
  const documents = [
    {
      id: 'company-overview',
      label: 'About DEKODE',
      text: `${companyKnowledge.company.about}\nMission: ${companyKnowledge.company.mission}\nWhy DEKODE exists: ${companyKnowledge.company.origin}\nVision: ${companyKnowledge.company.vision}\nBelief: ${companyKnowledge.company.belief}`,
    },
    {
      id: 'service-catalogue',
      label: 'DEKODE services',
      text: `DEKODE services and offerings:\n${companyKnowledge.services
        .map((service) => `${service.name}: ${service.summary}`)
        .join('\n')}`,
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
    {
      id: 'industries',
      label: 'Industries',
      text: `DEKODE works with small and medium businesses in: ${joinItems(companyKnowledge.industries)}.`,
    },
    {
      id: 'technology',
      label: 'Technology foundations',
      text: `Publicly named cloud platforms: ${joinItems(companyKnowledge.technologies)}. DEKODE selects technology around reliability, security, and maintainability.`,
    },
    {
      id: 'delivery-process',
      label: 'Delivery process',
      text: companyKnowledge.developmentProcess
        .map((step) => `${step.name}: ${step.description}`)
        .join('\n'),
    },
    {
      id: 'case-study-catalogue',
      label: 'DEKODE case studies',
      text: `Published DEKODE success stories:\n${companyKnowledge.caseStudies
        .map((study) => `${study.name} (${study.industry}): ${study.solution} Outcome: ${study.outcome}`)
        .join('\n')}`,
    },
    ...companyKnowledge.caseStudies.map((study) => ({
      id: `case-study-${study.id}`,
      label: `${study.name} case study`,
      text: `${study.name}\nIndustry: ${study.industry}\nPlatform: ${study.platform}\nChallenge: ${study.challenge}\nSolution: ${study.solution}\nOutcome: ${study.outcome}`,
    })),
    {
      id: 'values',
      label: 'How DEKODE works',
      text: companyKnowledge.values
        .map((value) => `${value.name}: ${value.description}`)
        .join('\n'),
    },
    {
      id: 'contact',
      label: 'Contact',
      text: `Email: ${companyKnowledge.contact.email}. Phone numbers: ${joinItems(companyKnowledge.contact.phones)}. WhatsApp: +${companyKnowledge.contact.whatsapp}.`,
    },
    {
      id: 'locations',
      label: 'DEKODE locations',
      text: `DEKODE office locations and addresses. ${companyKnowledge.contact.operatingModel}\n${companyKnowledge.contact.locations
        .map((location) => `${location.country}: ${location.address}`)
        .join('\n')}`,
    },
    {
      id: 'privacy-policy',
      label: companyKnowledge.legal.privacy.title,
      text: `${companyKnowledge.legal.privacy.summary}\nPrivacy contact: ${companyKnowledge.legal.privacy.contactEmail}.\n${companyKnowledge.legal.privacy.sections
        .map((section) => `${section.title}: ${section.summary}`)
        .join('\n')}`,
    },
    {
      id: 'terms-of-service',
      label: companyKnowledge.legal.terms.title,
      text: `${companyKnowledge.legal.terms.summary}\n${companyKnowledge.legal.terms.sections
        .map((section) => `${section.title}: ${section.summary}`)
        .join('\n')}`,
    },
    ...companyKnowledge.faqs.map((faq, index) => ({
      id: `faq-${index + 1}`,
      label: 'FAQ',
      text: `Question: ${faq.question}\nAnswer: ${faq.answer}`,
    })),
  ];

  return documents.map((document) => ({
    ...document,
    terms: tokenize(`${document.label} ${document.text}`),
  }));
}

const documents = makeDocuments();

export function retrieveCompanyKnowledge(question, limit = 5) {
  const queryTerms = tokenize(question);
  const query = normalise(question);

  const ranked = documents
    .map((document) => {
      const overlap = queryTerms.filter((term) => document.terms.includes(term)).length;
      const nameBonus = query.includes(normalise(document.label)) ? 3 : 0;
      return { ...document, score: overlap + nameBonus };
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
