import React, { useEffect } from 'react';
import { Mail } from 'lucide-react';
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
        
        <div className="content-section-heading">
          <p className="section-eyebrow">LEGAL</p>
          <h2>{document.title}</h2>
        </div>
        
        <div className="company-info-grid" style={{ gridTemplateColumns: '1fr' }}>
          <section className="company-info-block">
            <article className="company-legal-content" style={{ marginTop: 0 }}>
              <p style={{ fontSize: '1.05rem', color: 'white', marginBottom: '1.5rem', lineHeight: 1.6 }}>{document.summary}</p>
              
              {document.contactEmail && (
                <a className="company-legal-contact" href={`mailto:${document.contactEmail}`}>
                  <Mail size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> Enquiries: {document.contactEmail}
                </a>
              )}
              
              <div style={{ marginTop: '2rem' }}>
                {document.sections.map((section) => (
                  <div key={section.title} style={{ padding: '1.25rem 0', borderTop: '1px solid rgba(255,255,255,.08)' }}>
                    <h4 style={{ fontSize: '1.1rem', color: 'var(--story-yellow)', marginBottom: '0.75rem' }}>{section.title}</h4>
                    <p style={{ color: 'var(--story-muted)', fontSize: '0.9rem', lineHeight: 1.65 }}>{section.summary}</p>
                  </div>
                ))}
              </div>
            </article>
          </section>
        </div>
      </section>
    </main>
  );
}
