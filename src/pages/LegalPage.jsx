import React, { useEffect } from 'react';
import { loadCompanyKnowledge } from '../knowledge/companyKnowledgeLoader';
import '../components/interactive-content.css';

export default function LegalPage({ type }) {
  const companyKnowledge = loadCompanyKnowledge();
  const document = companyKnowledge.legal[type];

  // Scroll to top when mounted
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);

  if (!document) return null;

  return (
    <main className="content-container interactive-content-enabled" style={{ height: '100%', overflowY: 'auto' }}>
      <section className="story-section company-info-section" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <a href="/" style={{ color: 'var(--story-yellow)', textDecoration: 'none', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            &larr; Back to Home
          </a>
        </div>
        
        <div className="company-info-grid" style={{ gridTemplateColumns: '1fr' }}>
          <section className="company-info-block">
            <article className="company-legal-content">
              <h3>{document.title}</h3>
              <p>{document.summary}</p>
              {document.contactEmail && (
                <a className="company-legal-contact" href={`mailto:${document.contactEmail}`}>
                  {type === 'privacy' ? 'Privacy enquiries: ' : 'Terms enquiries: '}
                  {document.contactEmail}
                </a>
              )}
              {document.sections.map((section) => (
                <div key={section.title}>
                  <h4>{section.title}</h4>
                  <p>{section.summary}</p>
                </div>
              ))}
            </article>
          </section>
        </div>
      </section>
    </main>
  );
}
