import { loadCompanyKnowledge } from './companyKnowledgeLoader.js';

const knowledge = loadCompanyKnowledge();

const PROJECT_FOCUSES = [
  {
    id: 'website',
    label: 'Website',
    projectType: 'Web App',
    serviceId: 'web-mobile',
    solutionId: 'web-app',
    terms: ['website', 'webiste', 'wesbite', 'web site', 'webpage', 'web app', 'web application', 'portal', 'dashboard'],
    heading: 'A website, understood.',
    question: 'What should the website help visitors do first: understand your offer, enquire or book, buy something, or use a signed-in service?',
  },
  {
    id: 'mobile',
    label: 'Mobile app',
    projectType: 'Mobile App',
    serviceId: 'web-mobile',
    solutionId: 'mobile-app',
    terms: ['mobile app', 'ios app', 'android app', 'iphone app', 'phone app'],
    heading: 'A mobile app, understood.',
    question: 'Who will use the app, and what is the one task they should be able to complete with the least friction?',
  },
  {
    id: 'ecommerce',
    label: 'E-commerce platform',
    projectType: 'E-commerce',
    serviceId: 'ecommerce',
    solutionId: 'ecommerce',
    terms: ['ecommerce', 'e-commerce', 'online store', 'online shop', 'marketplace', 'shopping platform'],
    heading: 'An e-commerce build, understood.',
    question: 'Are you launching a new store or improving an existing one, and where is the biggest friction today: discovery, checkout, fulfilment, or retention?',
  },
  {
    id: 'automation',
    label: 'Automation',
    projectType: 'Process Automation',
    serviceId: 'integrations',
    solutionId: 'process-automation',
    terms: ['automation', 'automate', 'manual process', 'manual workflow', 'repetitive work', 'copying data', 'data entry'],
    heading: 'This is an automation opportunity.',
    question: 'Which repeated workflow consumes the most time today, and which systems or approvals are involved?',
  },
  {
    id: 'integration',
    label: 'Systems integration',
    projectType: 'Systems Integration',
    serviceId: 'integrations',
    solutionId: 'systems-integration',
    terms: ['integration', 'integrate', 'systems do not talk', "systems don't talk", 'disconnected systems', 'connect our tools', 'connect systems'],
    heading: 'This is a systems integration problem.',
    question: 'Which systems need to exchange data, and which one should remain the source of truth?',
  },
  {
    id: 'ai',
    label: 'AI solution',
    projectType: 'AI Automation',
    serviceId: 'custom-ai',
    terms: ['artificial intelligence', 'generative ai', 'gen ai', 'genai', 'ai agent', 'copilot', 'chatbot', 'machine learning', 'predictive model'],
    heading: 'An AI solution, understood.',
    question: 'Which business task should the AI improve, and what approved data, documents, or systems can it use?',
  },
  {
    id: 'cloud',
    label: 'Cloud solution',
    projectType: 'Cloud Solutions',
    serviceId: 'cloud-it',
    terms: ['cloud', 'migration', 'infrastructure', 'hosting', 'aws', 'azure', 'gcp'],
    heading: 'A cloud initiative, understood.',
    question: 'What runs today, and which concern matters most: reliability, security, cost, migration risk, or scale?',
  },
];

const normalise = (value) => String(value ?? '')
  .toLowerCase()
  .replace(/[^a-z0-9\s'-]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

function editDistance(left, right) {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const current = [leftIndex];
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      current[rightIndex] = Math.min(
        current[rightIndex - 1] + 1,
        previous[rightIndex] + 1,
        previous[rightIndex - 1] + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1),
      );
    }
    previous.splice(0, previous.length, ...current);
  }
  return previous[right.length];
}

function containsNearWord(text, expected) {
  if (expected.includes(' ') || expected.length < 5) return false;
  return text.split(' ').some((word) =>
    word.length >= 5 && Math.abs(word.length - expected.length) <= 2 && editDistance(word, expected) <= 2,
  );
}

function containsTerm(input, term) {
  if (!term.includes(' ') && term.length <= 3) return input.split(' ').includes(term);
  return input.includes(term);
}

export function detectProjectFocus(message) {
  const input = normalise(message);
  return PROJECT_FOCUSES.find((focus) => focus.terms.some((term) => {
    const normalisedTerm = normalise(term);
    return containsTerm(input, normalisedTerm) || containsNearWord(input, normalisedTerm);
  })) || null;
}

export function isProjectRequest(message) {
  const input = normalise(message);
  const asksForOwnBuild = /\b(build|create|develop|design)\s+(me|us|my|our)\b/i.test(input);
  if (/^(can|could|do|does|would)\s+you\b/i.test(input) && !asksForOwnBuild) return false;
  return asksForOwnBuild
    || /\b(i|we)\s+(want|wnat|need|would like|are looking|struggle|have a problem)\b/i.test(input)
    || /\b(help|support)\s+(me|us)\b/i.test(input)
    || /\b(my|our)\s+(website|webiste|wesbite|app|application|platform|project|process|workflow|system|idea|team|business)\b/i.test(input)
    || /^(build|create|creat|develop|design|modernise|modernize|improve|replace|automate|connect)\b/i.test(input)
    || /\b(manual|repetitive|slow|inefficient|bottleneck|outgrown|keeps breaking|too much time)\b/i.test(input);
}

export function buildProjectRetrievalQuery(message) {
  const focus = detectProjectFocus(message);
  if (!focus) return message;
  const service = knowledge.services.find((item) => item.id === focus.serviceId);
  return `${message}\nRelevant intent: ${focus.label}. Relevant DEKODE capability: ${service?.name || focus.projectType}.`;
}

export function generateProjectResponse(message) {
  const focus = detectProjectFocus(message);
  if (!focus) {
    return {
      text: '**Let\'s understand the problem first.**\n\nDEKODE shapes practical digital products around the people, workflow, and business outcome involved, then carries them from strategy and UX through secure delivery and support.\n\nWhat is happening today, who is affected, and what should become easier or better?',
      projectType: 'Custom Project',
      topic: 'services',
      panel: 'services',
    };
  }

  const service = knowledge.services.find((item) => item.id === focus.serviceId);
  const solution = knowledge.solutionAreas.find((item) => item.id === focus.solutionId);
  const evidence = solution?.summary || service?.summary || 'DEKODE takes practical digital projects from discovery through secure production delivery.';
  return {
    text: `**${focus.heading}**\n\n${evidence}\n\n${focus.question}`,
    projectType: focus.projectType,
    topic: focus.id === 'ai' ? 'ai' : 'services',
    panel: focus.id === 'ai' ? 'ai' : 'services',
  };
}
