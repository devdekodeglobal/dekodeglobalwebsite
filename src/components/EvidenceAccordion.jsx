import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import foodManufacturingImage from '../assets/case-study-food-manufacturing.jpg';
import primarySchoolImage from '../assets/case-study-primary-school.jpg';
import attendMeImage from '../assets/portfolio/attendme.png';
import chauffrImage from '../assets/portfolio/chauffr.png';
import smartLoanImage from '../assets/portfolio/smart-loan.png';
import smartBrokerImage from '../assets/portfolio/smartbroker.png';
import recycledMarketImage from '../assets/portfolio/recycled-market.png';
import estradoImage from '../assets/portfolio/estrado.png';
import ugnamiImage from '../assets/portfolio/ugnami.png';
import krafcImage from '../assets/portfolio/krafc.png';

const images = {
  'food-manufacturing': foodManufacturingImage,
  'primary-school': primarySchoolImage,
  attendme: attendMeImage,
  chauffr: chauffrImage,
  'smart-loan-helper': smartLoanImage,
  smartbroker: smartBrokerImage,
  'recycled-market': recycledMarketImage,
  estrado: estradoImage,
  ugnami: ugnamiImage,
  krafc: krafcImage,
};

function formatSectionText(text, website, name) {
  if (!text) return '';
  const mdLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  if (mdLinkRegex.test(text)) {
    const elements = [];
    let lastIndex = 0;
    let match;
    mdLinkRegex.lastIndex = 0;
    while ((match = mdLinkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        elements.push(text.slice(lastIndex, match.index));
      }
      elements.push(
        <a
          key={match.index}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#00d2ff', fontWeight: 600, textDecoration: 'underline' }}
        >
          {match[1]}
        </a>
      );
      lastIndex = mdLinkRegex.lastIndex;
    }
    if (lastIndex < text.length) {
      elements.push(text.slice(lastIndex));
    }
    return elements;
  }

  if (website && name && text.includes(name)) {
    const parts = text.split(name);
    return parts.reduce((acc, part, i) => {
      if (i === 0) return [part];
      return [
        ...acc,
        <a
          key={i}
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#00d2ff', fontWeight: 600, textDecoration: 'underline' }}
        >
          {name}
        </a>,
        part,
      ];
    }, []);
  }

  return text;
}

export default function EvidenceAccordion({ artifact }) {
  const [openId, setOpenId] = useState(() => artifact?.autoOpen ? artifact.items?.[0]?.id : null);
  if (!artifact?.items?.length) return null;

  return (
    <div className="evidence-accordion" aria-label={artifact.label}>
      <div className="evidence-accordion-list">
        {artifact.items.map((item, index) => {
          const isOpen = openId === item.id;
          const panelId = `evidence-panel-${item.id}`;
          return (
            <div className={`evidence-accordion-item ${isOpen ? 'is-open' : ''}`} key={item.id}>
              <button
                type="button"
                className="evidence-accordion-trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
              >
                <span className="evidence-accordion-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="evidence-accordion-title">
                  <strong>{item.name}</strong>
                  <small>{item.kind}</small>
                </span>
                <ChevronDown size={17} aria-hidden="true" />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    className="evidence-accordion-panel"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.26, ease: 'easeOut' }}
                  >
                    <div className="evidence-accordion-content">
                      <div className={`evidence-media${item.id === 'attendme' ? ' evidence-media-attendme' : ''}${item.kind === 'Portfolio project' && item.id !== 'attendme' ? ' evidence-media-contain' : ''}`}>
                        {item.website ? (
                          <a
                            href={item.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="evidence-image-link"
                            title={`Visit ${item.name} (${item.website})`}
                            style={{ display: 'block', position: 'relative', cursor: 'pointer' }}
                          >
                            <img src={images[item.imageKey]} alt={`${item.name} project`} />
                          </a>
                        ) : (
                          <img src={images[item.imageKey]} alt={`${item.name} project`} />
                        )}
                      </div>
                      {item.facts?.length > 0 && (
                        <dl className="evidence-facts">
                          {item.facts.map((fact) => (
                            <div key={fact.label}>
                              <dt>{fact.label}</dt>
                              <dd>
                                {typeof fact.value === 'string' && /^https?:\/\//i.test(fact.value) ? (
                                  <a href={fact.value} target="_blank" rel="noopener noreferrer" style={{ color: '#00d2ff', textDecoration: 'underline' }}>
                                    {fact.value.replace(/^https?:\/\//i, '')}
                                  </a>
                                ) : (
                                  fact.value
                                )}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      )}
                      <div className="evidence-sections">
                        {item.sections.map((section) => (
                          <section key={section.label}>
                            <h4>{section.label}</h4>
                            <p>{formatSectionText(section.value, item.website, item.name)}</p>
                          </section>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
