const PANEL_BY_TOPIC = {
  company: 'overview',
  services: 'services',
  ai: 'ai',
  industries: 'industries',
  technologies: 'technologies',
  process: 'process',
  why: 'why',
  origin: 'overview',
  contact: 'contact',
  location: 'location',
  privacy: 'privacy',
  terms: 'terms',
  caseStudies: 'services',
  initiatives: 'overview',
};

export function getPanelForTopic(topic) {
  return PANEL_BY_TOPIC[topic] || 'overview';
}
