import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Factory,
  Mail,
  MapPin,
  MessageCircle,
  Mic,
  Phone,
  Scale,
  School,
  ShieldCheck,
  Sparkles,
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
  transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
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

export default function InteractiveContentSections() {
  const shouldReduceMotion = useReducedMotion();
  const [starRotation, setStarRotation] = useState(0);
  const [activeCapability, setActiveCapability] = useState(content.capabilities[0].id);
  const [activeProject, setActiveProject] = useState(content.selectedWork[0].id);
  const [activeStage, setActiveStage] = useState(content.deliveryProcess[0].id);
  const [activeIndustry, setActiveIndustry] = useState(content.industries[0].id);
  const [activeLegalDocument, setActiveLegalDocument] = useState("privacy");
  const [sessionSummary, setSessionSummary] = useState("");

  useEffect(() => subscribeToSessionSummary(setSessionSummary), []);

  const capability = content.capabilities.find((item) => item.id === activeCapability);
  const project = content.selectedWork.find((item) => item.id === activeProject);
  const stage = content.deliveryProcess.find((item) => item.id === activeStage);
  const industry = content.industries.find((item) => item.id === activeIndustry);
  const ProjectIcon = caseStudyIcons[project.id];
  const starItems = companyKnowledge.whyChooseUs;
  const activeStar = ((starRotation % starItems.length) + starItems.length) % starItems.length;

  const rotateStar = (direction) => {
    setStarRotation((current) => current + direction);
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
        <div
          className="star-principles"
          aria-label="DEKODE STAR principles"
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") rotateStar(-1);
            if (event.key === "ArrowRight") rotateStar(1);
          }}
        >
          <motion.div
            className="star-cylinder-stage"
            drag={shouldReduceMotion ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.08}
            onDragEnd={handleStarDragEnd}
            animate={{ rotateY: shouldReduceMotion ? 0 : starRotation * -90 }}
            transition={{ type: "spring", stiffness: 165, damping: 23 }}
          >
            {starItems.map((item, index) => (
              <article
                key={item.name}
                className={index === activeStar ? "is-active" : ""}
                style={{ "--star-position": index }}
              >
                <div className="star-card-mark" aria-hidden="true">
                  <span className="star-letter">{item.name[0]}</span>
                  <span className="star-index">0{index + 1}</span>
                </div>
                <div className="star-card-copy">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </motion.div>
          <div className="star-carousel-status" aria-label={`STAR principle ${activeStar + 1} of ${starItems.length}`}>
            {starItems.map((item, index) => (
              <button
                type="button"
                key={item.name}
                className={index === activeStar ? "is-active" : ""}
                aria-label={`Show ${item.name}`}
                aria-current={index === activeStar ? "true" : undefined}
                onClick={() => setStarRotation(index)}
              />
            ))}
          </div>
        </div>
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
        <div className="capability-switcher" role="tablist" aria-label="Select a DEKODE capability">
          {content.capabilities.map((item) => (
            <button
              type="button"
              role="tab"
              key={item.id}
              aria-selected={item.id === activeCapability}
              className={item.id === activeCapability ? "is-active" : ""}
              onClick={() => setActiveCapability(item.id)}
            >
              {item.title}
            </button>
          ))}
        </div>
        <motion.article
          key={capability.id}
          className="capability-detail"
          role="tabpanel"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="capability-detail-mark" aria-hidden="true"><Sparkles size={24} /></div>
          <div className="capability-detail-copy">
            <span>Selected capability</span>
            <h3>{capability.title}</h3>
            <p>{capability.fullDescription}</p>
            <strong>{capability.value}</strong>
          </div>
          <div className="capability-detail-actions">
            <div className="keyword-row">
              {capability.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}
            </div>
            <ChatAction section="capabilities" item={capability} label="Discuss this capability" />
          </div>
        </motion.article>
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
        <div className="methodology-layout">
          <div className="methodology-rail" role="tablist" aria-label="DEKODE delivery stages">
            {content.deliveryProcess.map((item, index) => (
              <button
                type="button"
                role="tab"
                aria-selected={item.id === activeStage}
                key={item.id}
                className={item.id === activeStage ? "is-active" : ""}
                onClick={() => setActiveStage(item.id)}
              >
                <span>0{index + 1}</span>
                <strong>{item.title}</strong>
              </button>
            ))}
          </div>
          <motion.article
            key={stage.id}
            className="methodology-detail"
            role="tabpanel"
            initial={shouldReduceMotion ? false : { opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <CheckCircle2 size={24} aria-hidden="true" />
            <span>Current stage</span>
            <h3>{stage.title}</h3>
            <p>{stage.description}</p>
            <ChatAction section="delivery-process" item={stage} label={stage.question} intent="guided_discovery" />
          </motion.article>
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
        <div className="industry-switcher" role="tablist" aria-label="Select an industry">
          {content.industries.map((item) => (
            <button
              type="button"
              role="tab"
              key={item.id}
              aria-selected={item.id === activeIndustry}
              className={item.id === activeIndustry ? "is-active" : ""}
              onClick={() => setActiveIndustry(item.id)}
            >
              {item.title}
            </button>
          ))}
        </div>
        <motion.article
          key={industry.id}
          className="industry-detail"
          role="tabpanel"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div>
            <span>Common challenge</span>
            <p>{industry.challenge}</p>
          </div>
          <div>
            <span>Solution direction</span>
            <p>{industry.solution}</p>
          </div>
          <div className="industry-capabilities">
            {industry.capabilities.map((item) => <span key={item}>{item}</span>)}
          </div>
          <ChatAction section="industries" item={industry} label={`Discuss ${industry.title}`} />
        </motion.article>
      </motion.section>

      <motion.section
        className="story-section company-info-section"
        {...(shouldReduceMotion ? { initial: false } : reveal)}
      >
        <SectionHeading
          eyebrow="Company information"
          title="Contact, locations and policies"
          description="Verified details from DEKODE's published company information."
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
