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
    <>
      <header className="chat-header">
        <a className="brand-logo" href={import.meta.env.BASE_URL || "/"} aria-label="Go to DEKODE home">
          DEKODE
        </a>
      </header>

      <main className="content-container interactive-content-enabled" style={{ height: '100%', overflowY: 'auto', paddingTop: '80px', paddingBottom: '4rem', display: 'flex', flexDirection: 'column' }}>
        <section className="story-section company-info-section" style={{ maxWidth: '800px', margin: '0 auto', flex: 1, width: '100%' }}>
          <div className="company-info-grid" style={{ gridTemplateColumns: '1fr', display: 'block' }}>
            <section className="company-legal-switcher" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
              <article className="company-legal-content">
                <h3>{document.title}</h3>
                <p>{document.summary}</p>
                {document.contactEmail && (
                  <a className="company-legal-contact" href={`mailto:${document.contactEmail}`}>
                    Privacy enquiries: {document.contactEmail}
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
    </>
  );
}
