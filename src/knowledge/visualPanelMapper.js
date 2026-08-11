const PANEL_BY_TOPIC = {
  company: 'overview',
  services: 'services',
  ai: 'ai',
  industries: 'industries',
  technologies: 'technologies',
  process: 'process',
  why: 'why',
  origin: 'overview',
  leadership: 'overview',
  contact: 'contact',
  location: 'location',
  privacy: 'privacy',
  terms: 'terms',
  caseStudies: 'portfolio',
  initiatives: 'overview',
};

export function getPanelForTopic(topic) {
  return PANEL_BY_TOPIC[topic] || 'overview';
}
