import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  BrainCircuit,
  CheckCircle2,
  Cloud,
  Code2,
  Layers3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Scale,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react';
import { loadCompanyKnowledge } from '../knowledge/companyKnowledgeLoader';
import foodManufacturingImage from '../assets/case-study-food-manufacturing.jpg';
import primarySchoolImage from '../assets/case-study-primary-school.jpg';
import attendMeImage from '../assets/portfolio/attendme.jpg';
import chauffrImage from '../assets/portfolio/chauffr.jpg';
import smartLoanImage from '../assets/portfolio/smart-loan.jpg';
import smartBrokerImage from '../assets/portfolio/smartbroker.png';
import recycledMarketImage from '../assets/portfolio/recycled-market.png';
import estradoImage from '../assets/portfolio/estrado.jpg';

const knowledge = loadCompanyKnowledge();

const serviceIcons = [BrainCircuit, Bot, Code2, Sparkles, Workflow, Cloud];

const evidenceImages = {
  'food-manufacturing': foodManufacturingImage,
  'primary-school': primarySchoolImage,
  attendme: attendMeImage,
  chauffr: chauffrImage,
  'smart-loan-helper': smartLoanImage,
  smartbroker: smartBrokerImage,
  'recycled-market': recycledMarketImage,
  estrado: estradoImage,
};

const stagger = {
  show: { transition: { staggerChildren: 0.08 } },
};

const itemMotion = {
  hidden: { opacity: 0, y: 14, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1 },
};

function PanelButton({ children, prompt, onSelect, className = '' }) {
  return (
    <motion.button
      variants={itemMotion}
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`knowledge-panel-button ${className}`}
      onClick={() => onSelect(prompt)}
      type="button"
    >
      {children}
    </motion.button>
  );
}

function OverviewPanel({ onSelect }) {
  const milestones = [
    ['Mission', knowledge.company.mission],
    ['Capabilities', 'Strategy, products, automation, cloud, and security'],
    ['Services', `${knowledge.services.length} connected service families`],
    ['Industries', `${knowledge.industries.length} sectors named in the company profile`],
    ['Innovation', 'Accessible, useful AI and digital transformation'],
  ];

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="knowledge-timeline">
      {milestones.map(([title, description], index) => (
        <PanelButton key={title} prompt={title === 'Mission' ? 'Tell me about DEKODE' : `Tell me about your ${title}`} onSelect={onSelect} className="timeline-card">
          <span className="timeline-index">{String(index + 1).padStart(2, '0')}</span>
          <span>
            <strong>{title}</strong>
            <small>{description}</small>
          </span>
        </PanelButton>
      ))}
    </motion.div>
  );
}

function ServicesPanel({ onSelect }) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="knowledge-card-grid services-panel-grid">
      {knowledge.services.map((service, index) => {
        const Icon = serviceIcons[index % serviceIcons.length];
        return (
          <PanelButton key={service.id} prompt={`Tell me more about ${service.name}`} onSelect={onSelect}>
            <Icon size={18} />
            <span>{service.name.replace(' Development', '').replace(' & Consulting', '')}</span>
          </PanelButton>
        );
      })}
    </motion.div>
  );
}

function PortfolioPanel({ onSelect }) {
  const evidence = [
    ...knowledge.caseStudies.map((study) => ({
      ...study,
      category: 'Published case study',
      description: study.solution,
      prompt: `Tell me about the ${study.name} case study`,
    })),
    ...knowledge.portfolioProjects.map((project) => ({
      ...project,
      category: 'Verified portfolio',
      prompt: `Tell me about the ${project.name} project`,
    })),
  ];

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="portfolio-panel">
      <motion.div variants={itemMotion} className="portfolio-panel-heading">
        <span><strong>Verified work</strong><small>Published DEKODE case studies and old-site portfolio projects</small></span>
        <span>{evidence.length}</span>
      </motion.div>
      <div className="portfolio-card-rail" aria-label="DEKODE project evidence">
        {evidence.map((item) => (
          <motion.button
            variants={itemMotion}
            type="button"
            className="portfolio-card"
            key={`${item.category}-${item.id}`}
            onClick={() => onSelect(item.prompt)}
          >
            <img src={evidenceImages[item.id]} alt={`${item.name} project`} />
            <span className="portfolio-card-copy">
              <small>{item.category}</small>
              <strong>{item.name}</strong>
              <span>{item.description}</span>
            </span>
          </motion.button>
        ))}
      </div>
      <motion.p variants={itemMotion} className="portfolio-panel-note">
        Swipe through the verified examples or select one for its challenge, solution, and outcome.
      </motion.p>
    </motion.div>
  );
}

function IndustriesPanel({ onSelect }) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="knowledge-card-grid industry-panel-grid">
      {knowledge.industries.map((industry) => (
        <PanelButton key={industry} prompt={`Tell me about your work in ${industry}`} onSelect={onSelect}>
          <Layers3 size={16} />
          <span>{industry}</span>
        </PanelButton>
      ))}
    </motion.div>
  );
}

function TechnologiesPanel({ onSelect }) {
  const technologies = [...knowledge.technologies, 'AI', 'Machine Learning', 'Generative AI', 'APIs'];
  return (
    <div className="tech-orbit">
      <div className="tech-orbit-core"><Code2 size={22} /><span>Practical stack</span></div>
      {technologies.map((technology, index) => (
        <motion.button
          key={technology}
          type="button"
          className="tech-badge"
          style={{ '--tech-index': index }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
          transition={{ opacity: { delay: index * 0.08 }, scale: { delay: index * 0.08 }, y: { repeat: Infinity, duration: 2.4 + index * 0.12 } }}
          onClick={() => onSelect(`Tell me about your ${technology} capabilities`)}
        >
          {technology}
        </motion.button>
      ))}
    </div>
  );
}

function ProcessPanel({ onSelect }) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="process-panel">
      {knowledge.developmentProcess.map((step, index) => (
        <React.Fragment key={step.name}>
          <PanelButton prompt={`Tell me more about the ${step.name} stage`} onSelect={onSelect} className="process-step-card">
            <span className="process-step-number">{index + 1}</span>
            <span>{step.name}</span>
          </PanelButton>
          {index < knowledge.developmentProcess.length - 1 && <motion.div variants={itemMotion} className="process-connector" />}
        </React.Fragment>
      ))}
    </motion.div>
  );
}

function WhyPanel({ onSelect }) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="why-panel">
      {knowledge.whyChooseUs.map((item) => (
        <PanelButton key={item.name} prompt={`What does ${item.name} mean at DEKODE?`} onSelect={onSelect}>
          <CheckCircle2 size={18} />
          <span>
            <strong>{item.name}</strong>
            <small>{item.description}</small>
          </span>
        </PanelButton>
      ))}
    </motion.div>
  );
}

function AiPanel({ onSelect }) {
  const nodes = ['Strategy', 'Custom AI', 'Copilots', 'Knowledge', 'Automation'];
  return (
    <div className="ai-knowledge-graph">
      <motion.button
        type="button"
        className="ai-graph-core"
        initial={{ scale: 0 }}
        animate={{ scale: 1, boxShadow: ['0 0 0 rgba(53,118,193,0)', '0 0 28px rgba(53,118,193,.55)', '0 0 0 rgba(53,118,193,0)'] }}
        transition={{ scale: { type: 'spring' }, boxShadow: { repeat: Infinity, duration: 2.5 } }}
        onClick={() => onSelect('Tell me about your AI services')}
      >
        <BrainCircuit size={26} />
        <span>AI</span>
      </motion.button>
      {nodes.map((node, index) => (
        <React.Fragment key={node}>
          <motion.span className={`ai-graph-line ai-line-${index + 1}`} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.2 + index * 0.08 }} />
          <motion.button
            type="button"
            className={`ai-graph-node ai-node-${index + 1}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', delay: 0.25 + index * 0.08 }}
            onClick={() => onSelect(`Tell me about ${node}`)}
          >
            {node}
          </motion.button>
        </React.Fragment>
      ))}
    </div>
  );
}

function RecommendationsPanel({ onSelect }) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="knowledge-card-grid services-panel-grid">
      {knowledge.services.slice(0, 6).map((service, index) => {
        const Icon = serviceIcons[index % serviceIcons.length];
        return (
          <PanelButton key={service.id} prompt={`Tell me more about ${service.name}`} onSelect={onSelect}>
            <Icon size={18} />
            <span>
              <strong>{service.name}</strong>
              <small>{service.summary}</small>
            </span>
          </PanelButton>
        );
      })}
    </motion.div>
  );
}

function MeetingPanel({ onSelect }) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="why-panel">
      <PanelButton prompt="I would like to request a meeting" onSelect={onSelect}>
        <CheckCircle2 size={18} />
        <span><strong>Preferred meeting time</strong><small>Choose a temporary preference in DEKODE Voice. The team confirms availability after submission.</small></span>
      </PanelButton>
      <PanelButton prompt="Help me prepare an enquiry instead" onSelect={onSelect}>
        <Workflow size={18} />
        <span><strong>Prepare an enquiry</strong><small>Review and edit all conversation-inferred details before submitting.</small></span>
      </PanelButton>
    </motion.div>
  );
}

function ContactPanel({ onSelect }) {
  const contactItems = [
    { label: 'Email', value: knowledge.contact.email, Icon: Mail },
    { label: 'Australia', value: knowledge.contact.phoneLabels[0], Icon: Phone },
    { label: 'India', value: knowledge.contact.phoneLabels[1], Icon: Phone },
    { label: 'WhatsApp', value: knowledge.contact.phoneLabels[0], Icon: MessageCircle },
  ];

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="knowledge-card-grid contact-panel-grid">
      {contactItems.map(({ label, value, Icon }) => (
        <PanelButton key={label} prompt={label === 'Email' ? 'How can I contact DEKODE?' : `Tell me about the DEKODE ${label} contact`} onSelect={onSelect}>
          <Icon size={18} />
          <span><strong>{label}</strong><small>{value}</small></span>
        </PanelButton>
      ))}
    </motion.div>
  );
}

function LocationPanel({ onSelect }) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="why-panel location-panel">
      {knowledge.contact.locations.map((location) => (
        <PanelButton key={location.country} prompt={`Tell me about your ${location.country} location`} onSelect={onSelect}>
          <MapPin size={18} />
          <span><strong>{location.country}</strong><small>{location.address}</small></span>
        </PanelButton>
      ))}
      <motion.p variants={itemMotion} className="knowledge-panel-note">{knowledge.contact.operatingModel}</motion.p>
    </motion.div>
  );
}

function LegalPanel({ onSelect, type }) {
  const document = knowledge.legal[type];
  const Icon = type === 'privacy' ? ShieldCheck : Scale;
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="legal-knowledge-panel">
      <motion.div variants={itemMotion} className="legal-panel-heading">
        <Icon size={22} />
        <span><strong>{document.title}</strong><small>{document.summary}</small></span>
      </motion.div>
      <div className="legal-topic-list">
        {document.sections.map((section, index) => (
          <PanelButton key={section.title} prompt={`Explain DEKODE's ${section.title} ${type === 'privacy' ? 'privacy policy' : 'terms'}`} onSelect={onSelect}>
            <span className="timeline-index">{String(index + 1).padStart(2, '0')}</span>
            <span>{section.title}</span>
          </PanelButton>
        ))}
      </div>
    </motion.div>
  );
}

const PrivacyPanel = (props) => <LegalPanel {...props} type="privacy" />;
const TermsPanel = (props) => <LegalPanel {...props} type="terms" />;

const panels = {
  overview: OverviewPanel,
  services: ServicesPanel,
  portfolio: PortfolioPanel,
  industries: IndustriesPanel,
  technologies: TechnologiesPanel,
  process: ProcessPanel,
  why: WhyPanel,
  ai: AiPanel,
  recommendations: RecommendationsPanel,
  meeting: MeetingPanel,
  contact: ContactPanel,
  location: LocationPanel,
  privacy: PrivacyPanel,
  terms: TermsPanel,
};

export default function CompanyKnowledgePanel({ panel = 'overview', onSelect }) {
  const Panel = panels[panel] || OverviewPanel;
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={panel}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        className="company-knowledge-panel"
      >
        <Panel onSelect={onSelect} />
      </motion.div>
    </AnimatePresence>
  );
}
