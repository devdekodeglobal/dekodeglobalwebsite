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
  
  const productItems = artifact?.items?.filter((item) => 
    item.id === 'krafc' || item.archetype === 'product' || item.categoryType === 'Spatial Design Platform' || item.categoryType === 'Shipped Product'
  ) || [];
  const projectItems = artifact?.items?.filter((item) => 
    item.id !== 'krafc' && item.archetype !== 'product' && item.archetype !== 'case_study' && item.kind !== 'Published case study' && item.categoryType !== 'Spatial Design Platform' && item.categoryType !== 'Shipped Product'
  ) || [];
  const caseStudyItems = artifact?.items?.filter((item) => 
    item.archetype === 'case_study' || item.kind === 'Published case study'
  ) || [];

  const categoriesPresent = [
    productItems.length > 0 && 'products',
    projectItems.length > 0 && 'projects',
    caseStudyItems.length > 0 && 'case_studies',
  ].filter(Boolean);

  const hasMultipleCategories = categoriesPresent.length > 1;

  const [activeTab, setActiveTab] = useState(() => {
    if (artifact?.scope === 'case_studies') return 'case_studies';
    if (artifact?.scope === 'products') return 'products';
    if (projectItems.length > 0) return 'projects';
    if (productItems.length > 0) return 'products';
    return 'all';
  });

  if (!artifact?.items?.length) return null;

  const visibleItems = !hasMultipleCategories || activeTab === 'all'
    ? artifact.items
    : activeTab === 'products'
      ? productItems
      : activeTab === 'projects'
        ? projectItems
        : caseStudyItems;

  const getItemBadgeClass = (item) => {
    if (item.id === 'krafc' || item.archetype === 'product' || item.categoryType === 'Spatial Design Platform' || item.categoryType === 'Shipped Product') {
      return 'kind-tag-product';
    }
    if (item.archetype === 'project' || item.kind === 'Client Project' || item.kind === 'Portfolio project') {
      return 'kind-tag-project';
    }
    return 'kind-tag-casestudy';
  };

  return (
    <div className="evidence-accordion" aria-label={artifact.label}>
      {hasMultipleCategories && (
        <div className="evidence-tabs-rail" role="tablist" aria-label="Filter evidence categories">
          {productItems.length > 0 && (
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'products'}
              className={`evidence-tab-btn ${activeTab === 'products' ? 'is-active is-products' : ''}`}
              onClick={() => {
                setActiveTab('products');
                setOpenId(null);
              }}
            >
              <span className="tab-glyph gold-glyph">✦</span>
              <span className="tab-label-full">Products</span>
              <span className="tab-label-short">Products</span>
              <span className="tab-count">{productItems.length}</span>
            </button>
          )}

          {projectItems.length > 0 && (
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'projects'}
              className={`evidence-tab-btn ${activeTab === 'projects' ? 'is-active is-projects' : ''}`}
              onClick={() => {
                setActiveTab('projects');
                setOpenId(null);
              }}
            >
              <span className="tab-glyph emerald-glyph">⚙</span>
              <span className="tab-label-full">Projects</span>
              <span className="tab-label-short">Projects</span>
              <span className="tab-count">{projectItems.length}</span>
            </button>
          )}

          {caseStudyItems.length > 0 && (
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'case_studies'}
              className={`evidence-tab-btn ${activeTab === 'case_studies' ? 'is-active is-casestudies' : ''}`}
              onClick={() => {
                setActiveTab('case_studies');
                setOpenId(null);
              }}
            >
              <span className="tab-glyph cyan-glyph">❖</span>
              <span className="tab-label-full">Case Studies</span>
              <span className="tab-label-short">Cases</span>
              <span className="tab-count">{caseStudyItems.length}</span>
            </button>
          )}

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'all'}
            className={`evidence-tab-btn ${activeTab === 'all' ? 'is-active' : ''}`}
            onClick={() => {
              setActiveTab('all');
              setOpenId(null);
            }}
          >
            <span>All</span>
            <span className="tab-count">{artifact.items.length}</span>
          </button>
        </div>
      )}

      <div className="evidence-accordion-list">
        {visibleItems.map((item, index) => {
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
                  <small className={getItemBadgeClass(item)}>
                    {item.categoryType || item.kind}
                  </small>
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
