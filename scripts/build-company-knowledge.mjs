import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = resolve(projectRoot, '..', 'Dekode');
const outputFile = resolve(projectRoot, 'src', 'knowledge', 'companyKnowledge.json');
const vertexOutputFile = resolve(projectRoot, 'gcp', 'vertex-chat', 'companyKnowledge.json');
const optional = process.argv.includes('--optional');

const sourceFiles = {
  about: resolve(sourceRoot, 'src', 'pages', 'About.jsx'),
  services: resolve(sourceRoot, 'src', 'pages', 'Services.jsx'),
  home: resolve(sourceRoot, 'src', 'pages', 'Home.jsx'),
  delivery: resolve(sourceRoot, 'src', 'components', 'DeliveryFlow.jsx'),
  foodManufacture: resolve(sourceRoot, 'src', 'pages', 'FoodManufacture.jsx'),
  primarySchool: resolve(sourceRoot, 'src', 'pages', 'PrimarySchool.jsx'),
  contact: resolve(sourceRoot, 'src', 'pages', 'Contact.jsx'),
  privacy: resolve(sourceRoot, 'src', 'pages', 'PrivacyPolicy.jsx'),
  terms: resolve(sourceRoot, 'src', 'pages', 'TermsOfService.jsx'),
  portfolio: resolve(sourceRoot, 'src', 'components', 'PortfolioShowcase.jsx'),
  bridge: resolve(sourceRoot, 'src', 'components', 'BridgeTeaser.jsx'),
};

const missingSourceFiles = [];

await Promise.all(
  Object.values(sourceFiles).map(async (path) => {
    try {
      await access(path);
    } catch {
      missingSourceFiles.push(path);
    }
  }),
);

if (missingSourceFiles.length > 0) {
  if (!optional) {
    throw new Error(
      `Missing DEKODE source files:\n${missingSourceFiles.map((path) => `- ${path}`).join('\n')}`,
    );
  }

  try {
    await access(outputFile);
  } catch {
    throw new Error(
      `Missing DEKODE source files and no committed knowledge file exists at ${outputFile}`,
    );
  }

  console.warn(
    `DEKODE source files are unavailable; using existing ${outputFile} for this build.`,
  );
  process.exit(0);
}

const entries = Object.fromEntries(
  await Promise.all(
    Object.entries(sourceFiles).map(async ([key, path]) => [key, await readFile(path, 'utf8')]),
  ),
);

const clean = (value = '') =>
  value
    .replace(/<[^>]+>/g, ' ')
    .replace(/\{['"]\s*['"]\}/g, ' ')
    .replace(/\u00e2\u20ac\u2122/g, '’')
    .replace(/\u00e2\u20ac(?:\u0153|\u009d)/g, '"')
    .replace(/\s+/g, ' ')
    .trim();

const matchOne = (source, pattern, label) => {
  const match = source.match(pattern);
  if (!match) throw new Error(`Could not extract ${label}`);
  return clean(match[1]);
};

const matchRaw = (source, pattern, label) => {
  const match = source.match(pattern);
  if (!match) throw new Error(`Could not extract ${label}`);
  return match[1];
};

const extractServices = () => {
  const cards = [...entries.services.matchAll(
    /<div id="([^"]+)" className="service-detail-card"[\s\S]*?<h2 className="service-title">([\s\S]*?)<\/h2>[\s\S]*?<p className="service-lead">([\s\S]*?)<\/p>[\s\S]*?<div className="service-includes">([\s\S]*?)<\/div>[\s\S]*?<div className="service-for">[\s\S]*?<p>([\s\S]*?)<\/p>/g,
  )];

  if (cards.length !== 6) throw new Error(`Expected 6 services, found ${cards.length}`);

  return cards.map(([, id, name, summary, includes, audience]) => ({
    id,
    name: clean(name),
    summary: clean(summary),
    capabilities: [...includes.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((match) => clean(match[1])),
    audience: clean(audience),
  }));
};

const extractProcess = () => {
  const block = matchOne(entries.delivery, /const steps = \[([\s\S]*?)\];/, 'delivery process');
  const steps = [...block.matchAll(
    /title:\s*'([^']+)'[\s\S]*?desc:\s*'([^']+)'/g,
  )].map(([, name, description]) => ({ name: clean(name), description: clean(description) }));
  if (steps.length !== 5) throw new Error(`Expected 5 delivery steps, found ${steps.length}`);
  return steps;
};

const extractDifferences = () => {
  const section = matchRaw(
    entries.about,
    /<section className="about-different-section"[\s\S]*?<div className="differences-grid">([\s\S]*?)<\/section>/,
    'company differentiators',
  );
  return [...section.matchAll(
    /<div className="difference-card"[\s\S]*?<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/g,
  )].map(([, name, description]) => ({ name: clean(name), description: clean(description) }));
};

const extractOrigin = () => {
  const section = matchRaw(
    entries.about,
    /<section className="about-why-section[\s\S]*?<div className="about-text-content">([\s\S]*?)<\/div>/,
    'company origin',
  );
  return [...section.matchAll(/<p(?:\s+className="[^"]+")?>([\s\S]*?)<\/p>/g)]
    .map((match) => clean(match[1]))
    .join(' ');
};

const extractPrinciples = () => {
  const section = matchOne(entries.home, /<div className="principles-grid container">([\s\S]*?)\.map\(/, 'principles');
  return [...section.matchAll(
    /\{\s*title:\s*"([^"]+)",\s*desc:\s*"([^"]+)"\s*\}/g,
  )].map(([, name, description]) => ({ name: clean(name), description: clean(description) }));
};

const extractCaseStudy = ({ id, sourceKey, outcomeSection, sourceReference, aliases = [] }) => {
  const source = entries[sourceKey];
  const outcomeBlock = matchRaw(source, outcomeSection, `${id} case-study outcome`);
  return {
    id,
    name: matchOne(source, /<h1[^>]*>([\s\S]*?)<\/h1>/, `${id} name`),
    industry: matchOne(source, /<h3>Industry<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/, `${id} industry`),
    platform: matchOne(source, /<h3>Solution Platform<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/, `${id} platform`),
    challenge: matchOne(source, /<h3>Challenge<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/, `${id} challenge`),
    solution: matchOne(source, /<h3>Solution<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/, `${id} solution`),
    outcome: [...outcomeBlock.matchAll(/<p>([\s\S]*?)<\/p>/g)]
      .map((match) => clean(match[1]))
      .join(' '),
    aliases,
    sourceReference,
  };
};

const extractInitiatives = () => {
  const source = entries.bridge;
  const regions = [...source.matchAll(
    /<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/g,
  )].map(([, name, description]) => ({
    name: clean(name),
    description: clean(description),
  }));
  return [{
    id: 'bridge',
    name: 'BRIDGE',
    title: matchOne(source, /<h2 className="bridge-title">([\s\S]*?)<\/h2>/, 'BRIDGE title'),
    status: matchOne(source, /<div className="bridge-badge">([\s\S]*?)<\/div>/, 'BRIDGE status'),
    summary: matchOne(source, /<p className="bridge-subtitle">([\s\S]*?)<\/p>/, 'BRIDGE summary'),
    regions,
    pillars: [...source.matchAll(/<div className="pillar">([\s\S]*?)<\/div>/g)]
      .map((match) => clean(match[1])),
    aliases: ['BRIDGE Initiative', 'Australia India bridge'],
    sourceReference: 'DEKODE/src/components/BridgeTeaser.jsx',
  }];
};

const extractPortfolioProjects = () => {
  const block = matchRaw(entries.portfolio, /const projects = \[([\s\S]*?)\n  \];/, 'portfolio projects');
  const projects = [...block.matchAll(
    /\{\s*id:\s*\d+,[\s\S]*?title:\s*'([^']+)'[\s\S]*?paragraphs:\s*\[([\s\S]*?)\]\s*\}/g,
  )].map(([, name, paragraphs]) => ({
    id: clean(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    name: clean(name),
    description: [...paragraphs.matchAll(/'([^']+)'/g)]
      .map((match) => clean(match[1]))
      .join(' '),
    sourceReference: 'DEKODE/src/components/PortfolioShowcase.jsx',
  }));
  if (projects.length !== 6) throw new Error(`Expected 6 portfolio projects, found ${projects.length}`);
  return projects;
};

const extractLegalSections = (source, expectedCount, label) => {
  const sections = [...source.matchAll(
    /<section className="[^"]*"[\s\S]*?<h2[^>]*>([\s\S]*?)<\/h2>([\s\S]*?)<\/section>/g,
  )]
    .slice(0, expectedCount)
    .map(([, title, body]) => ({
      title: clean(title).replace(/^\d{2}\.\s*/, ''),
      summary: clean(body),
    }));

  if (sections.length !== expectedCount) {
    throw new Error(`Expected ${expectedCount} ${label} sections, found ${sections.length}`);
  }
  return sections;
};

const industriesSentence = matchOne(
  entries.about,
  /We partner with small and medium businesses across([\s\S]*?)<\/p>/,
  'industries',
);
const industries = industriesSentence
  .replace(/^ /, '')
  .split('.')[0]
  .replace(', and ', ', ')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);

const services = extractServices();
const developmentProcess = extractProcess();
const whyChooseUs = extractDifferences();
const values = extractPrinciples();
const caseStudies = [
  extractCaseStudy({
    id: 'food-manufacturing',
    sourceKey: 'foodManufacture',
    outcomeSection: /<section className="fm-outcomes-section[^"]*">([\s\S]*?)<\/section>/,
    sourceReference: 'DEKODE/src/pages/FoodManufacture.jsx',
    aliases: ['Beston'],
  }),
  extractCaseStudy({
    id: 'primary-school',
    sourceKey: 'primarySchool',
    outcomeSection: /<section className="ps-help-section[^"]*">([\s\S]*?)<\/section>/,
    sourceReference: 'DEKODE/src/pages/PrimarySchool.jsx',
  }),
];
const portfolioProjects = extractPortfolioProjects();
const initiatives = extractInitiatives();
const solutionAreas = [
  {
    id: 'ai-strategy',
    name: 'AI Strategy & Consulting',
    serviceId: 'ai-strategy',
    summary: 'DEKODE helps teams assess AI readiness, identify useful opportunities, prioritise use cases, review data and workflows, and build a responsible, vendor-neutral AI roadmap.',
  },
  {
    id: 'generative-ai',
    name: 'Generative AI',
    serviceId: 'custom-ai',
    summary: 'DEKODE builds generative AI solutions tailored to business workflows, including internal copilots, intelligent search, knowledge systems, and AI-powered support and operations tools.',
  },
  {
    id: 'agentic-ai',
    name: 'Agentic AI',
    serviceId: 'custom-ai',
    summary: 'DEKODE designs AI agents for defined business workflows, connecting them to approved tools, APIs, and knowledge while accounting for permissions, human oversight, privacy, safety, and governance.',
  },
  {
    id: 'predictive-ai',
    name: 'Predictive AI',
    serviceId: 'custom-ai',
    summary: 'DEKODE develops custom machine learning solutions that use relevant business data to support forecasting, prioritisation, and better operational decisions. The right approach depends on the use case and data readiness.',
  },
  {
    id: 'analytical-ai',
    name: 'Analytical AI',
    serviceId: 'custom-ai',
    summary: 'DEKODE applies AI and machine learning to business data to surface useful patterns and decision support, delivered through practical workflows, dashboards, or internal tools.',
  },
  {
    id: 'mobile-app',
    name: 'Mobile App',
    serviceId: 'web-mobile',
    summary: 'DEKODE designs and develops iOS and Android mobile apps with user journeys, prototypes, accessible interfaces, integrations, security, and production-ready delivery.',
  },
  {
    id: 'web-app',
    name: 'Web App',
    serviceId: 'web-mobile',
    summary: 'DEKODE builds web applications, dashboards, and internal portals around real user workflows, from UX and rapid prototyping through secure production delivery.',
  },
  {
    id: 'cloud-solutions',
    name: 'Cloud Solutions',
    serviceId: 'cloud-it',
    summary: 'DEKODE provides cloud strategy, architecture, migration, monitoring, security hardening, and ongoing optimisation across AWS, Azure, and Google Cloud Platform.',
  },
  {
    id: 'process-automation',
    name: 'Process Automation',
    serviceId: 'integrations',
    summary: 'DEKODE automates repetitive business processes across operations, finance, and support, connecting the required systems so information moves cleanly and teams spend less time on manual work.',
  },
  {
    id: 'systems-integration',
    name: 'Systems Integration',
    serviceId: 'integrations',
    summary: 'DEKODE connects business systems through custom APIs and third-party integrations, including payment, chat, text, and email services, with reliable data flows and maintainable delivery.',
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    serviceId: 'ecommerce',
    summary: 'DEKODE builds scalable e-commerce platforms with intelligent search, personalised recommendations, inventory and fulfilment automation, payment integrations, and performance-focused user experiences.',
  },
];
const australianLocation = matchOne(
  entries.contact,
  /<strong>Australia<\/strong>\s*-\s*([\s\S]*?)<\/p>/,
  'Australia location',
);
const indiaLocation = matchOne(
  entries.contact,
  /<strong>India<\/strong>\s*-\s*([\s\S]*?)<\/p>/,
  'India location',
);
const phoneNumbers = [...new Set(
  [...entries.contact.matchAll(/href="tel:([^"]+)"/g)].map((match) => match[1]),
)];
const phoneLabels = [...new Set(
  [...entries.contact.matchAll(/<span className="phone-number">([\s\S]*?)<\/span>/g)]
    .map((match) => clean(match[1])),
)];

const knowledge = {
  schemaVersion: 1,
  source: {
    repository: 'website/DEKODE',
    files: Object.values(sourceFiles).map((path) => path.slice(sourceRoot.length + 1).replaceAll('\\', '/')),
    generatedAt: 'build-time',
  },
  company: {
    name: 'DEKODE',
    about: matchOne(entries.about, /<p className="about-lead">([\s\S]*?)<\/p>/, 'about statement'),
    mission: matchOne(entries.about, /<h2 className="about-subheadline">([\s\S]*?)<\/h2>/, 'mission'),
    origin: extractOrigin(),
    vision: matchOne(
      entries.about,
      /DEKODE is building toward becoming([\s\S]*?)<\/p>/,
      'vision',
    ).replace(/^/, 'DEKODE is building toward becoming '),
    belief: matchOne(entries.about, /<p className="about-accent-text">([\s\S]*?)<\/p>/, 'company belief'),
  },
  services,
  solutionAreas,
  industries,
  technologies: ['AWS', 'Azure', 'Google Cloud Platform'],
  capabilities: [...new Set(services.flatMap((service) => service.capabilities))],
  whyChooseUs,
  values,
  caseStudies,
  portfolioProjects,
  initiatives,
  developmentProcess,
  contact: {
    email: entries.contact.match(/mailto:([^"]+)/)?.[1] || null,
    phone: phoneNumbers[0] || null,
    phones: phoneNumbers,
    phoneLabels: phoneLabels.slice(0, phoneNumbers.length),
    whatsapp: entries.contact.match(/https:\/\/wa\.me\/([0-9]+)/)?.[1] || null,
    locations: [
      { country: 'Australia', address: australianLocation },
      { country: 'India', address: indiaLocation },
    ],
    operatingModel: matchOne(
      entries.contact,
      /<h3 className="floating-title">Where We Work<\/h3>[\s\S]*?<p className="floating-desc">([\s\S]*?)<\/p>/,
      'operating locations',
    ),
  },
  legal: {
    privacy: {
      title: 'Privacy Policy',
      contactEmail: entries.privacy.match(/mailto:([^"]+)/)?.[1] || null,
      summary: matchOne(
        entries.privacy,
        /<p className="text-xl[^>]*>([\s\S]*?)<\/p>/,
        'privacy summary',
      ),
      sections: extractLegalSections(entries.privacy, 5, 'privacy'),
    },
    terms: {
      title: 'Terms of Service',
      summary: matchOne(
        entries.terms,
        /<p className="text-xl[^>]*>([\s\S]*?)<\/p>/,
        'terms summary',
      ),
      sections: extractLegalSections(entries.terms, 6, 'terms'),
    },
  },
  faqs: [
    {
      question: 'What does DEKODE do?',
      answer: 'DEKODE combines AI consultancy, solution development, infrastructure, security, and long-term support to deliver practical systems teams can adopt.',
    },
    {
      question: 'Who does DEKODE work with?',
      answer: `DEKODE partners with small and medium businesses across ${industries.join(', ')}.`,
    },
    {
      question: 'How does DEKODE deliver projects?',
      answer: `DEKODE follows five stages: ${developmentProcess.map((step) => step.name).join(', ')}.`,
    },
  ],
  aliases: {
    ai: ['artificial intelligence', 'machine learning', 'ml', 'generative ai', 'genai', 'llm', 'copilot', 'agent', 'agents'],
    services: ['service', 'offer', 'offering', 'solutions', 'build', 'capabilities'],
    industries: ['industry', 'industries', 'sector', 'sectors', 'clients', 'customers', 'work with'],
    technologies: ['technology', 'technologies', 'tech', 'tech stack', 'stack', 'platforms', 'tools'],
    process: ['process', 'method', 'methodology', 'workflow', 'delivery', 'how you work', 'approach'],
    why: ['why choose', 'different', 'difference', 'values', 'culture', 'principles'],
    caseStudies: ['case study', 'case studies', 'success story', 'success stories', 'portfolio', 'past work', 'projects', 'clients', 'food manufacturing', 'beston', 'primary school', 'attendme'],
    initiatives: ['initiative', 'initiatives', 'bridge', 'bridge initiative', 'australia india bridge'],
    company: ['dekode', 'company', 'business', 'who are you', 'about you', 'what do you do'],
    contact: ['contact', 'contact us', 'email', 'phone', 'whatsapp', 'get in touch', 'reach you'],
    location: ['location', 'locations', 'located', 'address', 'office', 'offices', 'where is', 'where are you', 'where are you based', 'headquarters', 'hq'],
    privacy: ['privacy', 'privacy policy', 'personal data', 'data protection', 'data security', 'my data'],
    terms: ['terms', 'terms and conditions', 'terms of service', 'conditions', 'legal', 'liability', 'intellectual property', 'governing law'],
  },
};

await mkdir(dirname(outputFile), { recursive: true });
const serializedKnowledge = `${JSON.stringify(knowledge, null, 2)}\n`;
await Promise.all([
  writeFile(outputFile, serializedKnowledge, 'utf8'),
  writeFile(vertexOutputFile, serializedKnowledge, 'utf8'),
]);
console.log(`Generated synchronized website and Vertex knowledge from ${knowledge.source.files.length} DEKODE source files.`);
