import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import foodManufacturingImage from '../assets/case-study-food-manufacturing.jpg';
import primarySchoolImage from '../assets/case-study-primary-school.jpg';
import attendMeImage from '../assets/portfolio/attendme.jpg';
import chauffrImage from '../assets/portfolio/chauffr.jpg';
import smartLoanImage from '../assets/portfolio/smart-loan.jpg';
import smartBrokerImage from '../assets/portfolio/smartbroker.png';
import recycledMarketImage from '../assets/portfolio/recycled-market.png';
import estradoImage from '../assets/portfolio/estrado.jpg';

const images = {
  'food-manufacturing': foodManufacturingImage,
  'primary-school': primarySchoolImage,
  attendme: attendMeImage,
  chauffr: chauffrImage,
  'smart-loan-helper': smartLoanImage,
  smartbroker: smartBrokerImage,
  'recycled-market': recycledMarketImage,
  estrado: estradoImage,
};

export default function EvidenceAccordion({ artifact }) {
  const [openId, setOpenId] = useState(() => artifact?.autoOpen ? artifact.items?.[0]?.id : null);
  if (!artifact?.items?.length) return null;

  return (
    <div className="evidence-accordion" aria-label={artifact.label}>
      <p className="evidence-accordion-label">{artifact.label}</p>
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
                      <div className={`evidence-media${item.id === 'attendme' ? ' evidence-media-attendme' : ''}`}>
                        <img src={images[item.imageKey]} alt={`${item.name} project`} />
                      </div>
                      {item.facts?.length > 0 && (
                        <dl className="evidence-facts">
                          {item.facts.map((fact) => (
                            <div key={fact.label}>
                              <dt>{fact.label}</dt>
                              <dd>{fact.value}</dd>
                            </div>
                          ))}
                        </dl>
                      )}
                      <div className="evidence-sections">
                        {item.sections.map((section) => (
                          <section key={section.label}>
                            <h4>{section.label}</h4>
                            <p>{section.value}</p>
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
