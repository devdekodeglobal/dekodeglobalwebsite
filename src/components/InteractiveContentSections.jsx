import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Calendar,
  ChevronDown,
  Factory,
  Mail,
  MapPin,
  MessageCircle,
  Mic,
  Phone,
  Scale,
  School,
  ShieldCheck,
} from "lucide-react";
import foodManufacturingImage from "../assets/case-study-food-manufacturing.jpg";
import primarySchoolImage from "../assets/case-study-primary-school.jpg";
import { interactiveSiteContent as content } from "../content/interactiveSiteContent";
import { loadCompanyKnowledge } from "../knowledge/companyKnowledgeLoader";
import {
  openDekodeVoice,
  sendContentToChat,
  subscribeToSessionSummary,
} from "../content/ContentToChatBridge";
import "./interactive-content.css";

const reveal = {
  initial: false,
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const starContainerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const giantLetterVariant = {
  hidden: { x: -80, opacity: 0, scale: 0.8 },
  visible: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", damping: 12, stiffness: 150 },
  },
};

const wordmarkVariant = {
  hidden: { opacity: 0, filter: "blur(4px)" },
  visible: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.5, ease: "easeOut" } },
};

const cardBodyVariant = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const companyKnowledge = loadCompanyKnowledge();
const caseStudyImages = {
  "food-manufacturing": foodManufacturingImage,
  "primary-school": primarySchoolImage,
};
const caseStudyIcons = {
  "food-manufacturing": Factory,
  "primary-school": School,
};

function ChatAction({ section, item, label, intent, className = "" }) {
  return (
    <button
      type="button"
      className={`content-chat-action ${className}`.trim()}
      onClick={() =>
        sendContentToChat({
          sourceSection: section,
          topic: item.title,
          intent,
          displayLabel: label,
          suggestedPrompt: item.chatPrompt,
          metadata: { id: item.id },
        })
      }
    >
      <MessageCircle size={16} aria-hidden="true" />
      <span>{label}</span>
      <ArrowUpRight size={15} aria-hidden="true" />
    </button>
  );
}

function SectionHeading({ eyebrow, title, description, compact = false }) {
  return (
    <header className={`content-section-heading ${compact ? "is-compact" : ""}`}>
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </header>
  );
}

function getWrappedOffset(index, activeIndex, total) {
  let offset = index - activeIndex;
  if (offset > total / 2) offset -= total;
  if (offset < -total / 2) offset += total;
  return offset;
}

function getCoverflowClass(offset) {
  if (offset === 0) return "is-active";
  if (offset === 1) return "is-next";
  if (offset === 2) return "is-next-far";
  if (offset < 0) return "is-previous";
  return "is-hidden";
}

export default function InteractiveContentSections() {
  const shouldReduceMotion = useReducedMotion();
  const [activeStar, setActiveStar] = useState(0);
  const [activeCapability, setActiveCapability] = useState(content.capabilities[0].id);
  const [activeProject, setActiveProject] = useState(content.selectedWork[0].id);
  const [activeStage, setActiveStage] = useState(content.deliveryProcess[0].id);
  const [activeIndustry, setActiveIndustry] = useState(content.industries[0].id);
  const [activeLegalDocument, setActiveLegalDocument] = useState("privacy");
  const [sessionSummary, setSessionSummary] = useState("");

  useEffect(() => subscribeToSessionSummary(setSessionSummary), []);

  const project = content.selectedWork.find((item) => item.id === activeProject);
  const ProjectIcon = caseStudyIcons[project.id];
  const starItems = companyKnowledge.whyChooseUs;

  const rotateStar = (direction) => {
    setActiveStar((current) => (current + direction + starItems.length) % starItems.length);
  };

  const handleStarDragEnd = (_event, info) => {
    const intent = info.offset.x + info.velocity.x * 0.12;
    if (Math.abs(intent) < 42) return;
    rotateStar(intent < 0 ? 1 : -1);
  };

  return (
    <main className="interactive-story" aria-label="Explore DEKODE">
      <motion.section
        className="story-section start-project-section"
        {...(shouldReduceMotion ? { initial: false } : reveal)}
      >
        <div className="start-project-copy">
          <span className="section-kicker">Start a project</span>
          <h2>What should we make useful?</h2>
          <p>Bring the idea, the friction or the unanswered question. We will help shape a practical next step.</p>
          {sessionSummary && (
            <div className="session-summary">
              <span>Your conversation</span>
              <p>{sessionSummary}</p>
            </div>
          )}
        </div>
        <div className="conversion-actions" aria-label="Ways to start with DEKODE">
          <button
            type="button"
            onClick={() => sendContentToChat({
              sourceSection: "start-project",
              topic: "New project",
              displayLabel: "Start chat",
              suggestedPrompt: content.conversionPrompts.start,
            })}
          >
            <MessageCircle size={18} />
            {sessionSummary ? "Continue the conversation" : "Start with an idea"}
          </button>
          <button type="button" onClick={() => openDekodeVoice()}>
            <Mic size={18} /> Talk with DEKODE
          </button>
          <button
            type="button"
            onClick={() => sendContentToChat({
              sourceSection: "start-project",
              topic: "Meeting",
              intent: "meeting_request",
              displayLabel: "Book a meeting",
              suggestedPrompt: content.conversionPrompts.meeting,
            })}
          >
            <Calendar size={18} /> Book a meeting
          </button>
        </div>
      </motion.section>

      <motion.section
        className="story-section company-statement-section"
        {...(shouldReduceMotion ? { initial: false } : reveal)}
      >
        <p className="company-belief">{companyKnowledge.company.belief}</p>
        <p className="company-about">{companyKnowledge.company.about}</p>
      </motion.section>

      <motion.section
        className="story-section star-section"
        {...(shouldReduceMotion ? { initial: false } : reveal)}
      >
        <SectionHeading
          eyebrow="The DEKODE standard"
          title="Simple enough to understand. Strong enough to rely on."
          description="Four principles guide how we communicate, deliver and stay accountable."
        />
        <motion.div
          className="star-principles"
          aria-label="DEKODE STAR principles"
          variants={shouldReduceMotion ? {} : starContainerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="star-coverflow-track">
            {starItems.map((item, index) => {
              return (
                <motion.article
                  key={item.name}
                  className="is-active"
                  data-number={`0${index + 1}`}
                >
                  <motion.h3 className="star-wordmark">
                    <motion.span 
                      className="star-letter" 
                      variants={giantLetterVariant}
                    >
                      {item.name[0]}
                    </motion.span>
                    <motion.span variants={wordmarkVariant}>
                      {item.name.slice(1)}
                    </motion.span>
                  </motion.h3>
                  <motion.p variants={cardBodyVariant}>
                    {item.description}
                  </motion.p>
                </motion.article>
              );
            })}
          </div>
        </motion.div>
      </motion.section>

      <motion.section
        className="story-section capabilities-section"
        {...(shouldReduceMotion ? { initial: false } : reveal)}
      >
        <SectionHeading
          eyebrow="Capabilities"
          title="One team across the digital journey"
          description="Choose an area to see where DEKODE can create practical value."
        />
        <div className="peek-accordion" aria-label="DEKODE capabilities">
          {content.capabilities.map((item, index) => (
            <article key={item.id} className={`peek-item ${item.id === activeCapability ? "is-open" : ""}`}>
              <h3>
                <button
                  type="button"
                  className="peek-header"
                  aria-expanded={item.id === activeCapability}
                  aria-controls={`capability-panel-${item.id}`}
                  onClick={() => setActiveCapability((current) => current === item.id ? null : item.id)}
                >
                  <span className="peek-index">0{index + 1}</span>
                  <span className="peek-header-copy">
                    <strong>{item.title}</strong>
                    <small>{item.shortDescription}</small>
                  </span>
                  <ChevronDown className="peek-chevron" size={18} aria-hidden="true" />
                </button>
              </h3>
              <div id={`capability-panel-${item.id}`} className="peek-panel" aria-hidden={item.id !== activeCapability}>
                <div className="peek-panel-inner">
                  <div className="peek-content capability-peek-content">
                    <div className="capability-detail-copy">
                      <p>{item.fullDescription}</p>
                      <strong>{item.value}</strong>
                    </div>
                    <div className="capability-detail-actions">
                      <div className="keyword-row">
                        {item.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}
                      </div>
                      <ChatAction section="capabilities" item={item} label="Discuss this capability" />
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="story-section work-section"
        {...(shouldReduceMotion ? { initial: false } : reveal)}
      >
        <SectionHeading
          eyebrow="Success stories"
          title="Evidence from real operating problems"
          description="Two published DEKODE case studies, focused on the challenge, the system and the result."
        />
        <div className="case-study-selector" role="tablist" aria-label="Select a DEKODE success story">
          {content.selectedWork.map((item) => {
            const Icon = caseStudyIcons[item.id];
            return (
              <button
                type="button"
                role="tab"
                aria-selected={item.id === activeProject}
                key={item.id}
                className={item.id === activeProject ? "is-active" : ""}
                onClick={() => setActiveProject(item.id)}
              >
                <Icon size={18} />
                <span><strong>{item.title}</strong><small>{item.industry}</small></span>
              </button>
            );
          })}
        </div>
        <motion.article
          key={project.id}
          className="case-study"
          role="tabpanel"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="case-study-media">
            <img src={caseStudyImages[project.id]} alt={`${project.title} case study`} />
            <span><ProjectIcon size={17} /> {project.industry}</span>
          </div>
          <div className="case-study-copy">
            <span className="section-kicker">Published case study</span>
            <h3>{project.title}</h3>
            <dl>
              <div><dt>Challenge</dt><dd>{project.challenge}</dd></div>
              <div><dt>Solution</dt><dd>{project.solution}</dd></div>
              <div className="case-study-outcome"><dt>Outcome</dt><dd>{project.outcome}</dd></div>
            </dl>
            <ChatAction section="selected-work" item={project} label="Discuss a similar project" />
          </div>
        </motion.article>
      </motion.section>

      <motion.section
        className="story-section methodology-section"
        {...(shouldReduceMotion ? { initial: false } : reveal)}
      >
        <SectionHeading
          eyebrow="Methodology"
          title="Progress you can see and understand"
          description="Each stage answers a useful question before the next investment is made."
        />
        <div className="peek-accordion" aria-label="DEKODE delivery stages">
            {content.deliveryProcess.map((item, index) => (
              <article key={item.id} className={`peek-item ${item.id === activeStage ? "is-open" : ""}`}>
                <h3>
                  <button
                    type="button"
                    className="peek-header"
                    aria-expanded={item.id === activeStage}
                    aria-controls={`methodology-panel-${item.id}`}
                    onClick={() => setActiveStage((current) => current === item.id ? null : item.id)}
                  >
                    <span className="peek-index">0{index + 1}</span>
                    <span className="peek-header-copy">
                      <strong>{item.title}</strong>
                      <small>{item.description}</small>
                    </span>
                    <ChevronDown className="peek-chevron" size={18} aria-hidden="true" />
                  </button>
                </h3>
                <div id={`methodology-panel-${item.id}`} className="peek-panel" aria-hidden={item.id !== activeStage}>
                  <div className="peek-panel-inner">
                    <div className="peek-content methodology-peek-content">
                      <p>{item.description}</p>
                      <ChatAction section="delivery-process" item={item} label={item.question} intent="guided_discovery" />
                    </div>
                  </div>
                </div>
              </article>
            ))}
        </div>
      </motion.section>

      <motion.section
        className="story-section industries-section"
        {...(shouldReduceMotion ? { initial: false } : reveal)}
      >
        <SectionHeading
          eyebrow="Services"
          title="Good systems begin with context"
          description="Select an industry to see how DEKODE connects capabilities around real operating needs."
        />
        <div className="peek-accordion" aria-label="DEKODE services by industry">
          {content.industries.map((item, index) => (
            <article key={item.id} className={`peek-item ${item.id === activeIndustry ? "is-open" : ""}`}>
              <h3>
                <button
                  type="button"
                  className="peek-header"
                  aria-expanded={item.id === activeIndustry}
                  aria-controls={`service-panel-${item.id}`}
                  onClick={() => setActiveIndustry((current) => current === item.id ? null : item.id)}
                >
                  <span className="peek-index">0{index + 1}</span>
                  <span className="peek-header-copy">
                    <strong>{item.title}</strong>
                    <small>{item.challenge}</small>
                  </span>
                  <ChevronDown className="peek-chevron" size={18} aria-hidden="true" />
                </button>
              </h3>
              <div id={`service-panel-${item.id}`} className="peek-panel" aria-hidden={item.id !== activeIndustry}>
                <div className="peek-panel-inner">
                  <div className="peek-content industry-peek-content">
                    <div>
                      <span>Common challenge</span>
                      <p>{item.challenge}</p>
                    </div>
                    <div>
                      <span>Solution direction</span>
                      <p>{item.solution}</p>
                    </div>
                    <div className="industry-capabilities">
                      {item.capabilities.map((capabilityName) => <span key={capabilityName}>{capabilityName}</span>)}
                    </div>
                    <ChatAction section="industries" item={item} label={`Discuss ${item.title}`} />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="story-section company-info-section"
        {...(shouldReduceMotion ? { initial: false } : reveal)}
      >
        <SectionHeading
          eyebrow="Company information"
          title="Contact, locations and policies"
          description="Details from DEKODE's published company information."
        />
        <div className="company-info-grid">
          <section className="company-info-block">
            <h3><Mail size={18} /> Contact DEKODE</h3>
            <a href={`mailto:${companyKnowledge.contact.email}`}>{companyKnowledge.contact.email}</a>
            {companyKnowledge.contact.phones.map((phone, index) => (
              <a href={`tel:${phone}`} key={phone}><Phone size={15} /> {companyKnowledge.contact.phoneLabels[index]}</a>
            ))}
            <a href={`https://wa.me/${companyKnowledge.contact.whatsapp}`} target="_blank" rel="noreferrer">
              <MessageCircle size={15} /> WhatsApp {companyKnowledge.contact.phoneLabels[0]}
            </a>
          </section>

          <section className="company-info-block">
            <h3><MapPin size={18} /> Where we work</h3>
            <p>{companyKnowledge.contact.operatingModel}</p>
            {companyKnowledge.contact.locations.map((location) => (
              <p key={location.country}><strong>{location.country}</strong><span>{location.address}</span></p>
            ))}
          </section>

          <section className="company-legal-switcher">
            <div className="company-legal-toggle" role="tablist" aria-label="DEKODE legal information">
              {[
                ["privacy", ShieldCheck],
                ["terms", Scale],
              ].map(([type, Icon]) => {
                const document = companyKnowledge.legal[type];
                const isActive = activeLegalDocument === type;
                return (
                  <button
                    type="button"
                    role="tab"
                    key={type}
                    className={isActive ? "is-active" : ""}
                    aria-selected={isActive}
                    aria-controls="company-legal-content"
                    onClick={() => setActiveLegalDocument(type)}
                  >
                    <Icon size={18} /><span>{document.title}</span>
                  </button>
                );
              })}
            </div>
            <article id="company-legal-content" className="company-legal-content" role="tabpanel">
              <h3>{companyKnowledge.legal[activeLegalDocument].title}</h3>
              <p>{companyKnowledge.legal[activeLegalDocument].summary}</p>
              {companyKnowledge.legal[activeLegalDocument].contactEmail && (
                <a className="company-legal-contact" href={`mailto:${companyKnowledge.legal[activeLegalDocument].contactEmail}`}>
                  Privacy enquiries: {companyKnowledge.legal[activeLegalDocument].contactEmail}
                </a>
              )}
              {companyKnowledge.legal[activeLegalDocument].sections.map((section) => (
                <div key={section.title}>
                  <h4>{section.title}</h4>
                  <p>{section.summary}</p>
                </div>
              ))}
            </article>
          </section>
        </div>
      </motion.section>
    </main>
  );
}
