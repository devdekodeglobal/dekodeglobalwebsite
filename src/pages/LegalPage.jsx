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

  const isPrivacy = type === 'privacy';

  return (
    <>
      <header className="chat-header">
        <a className="brand-logo" href={import.meta.env.BASE_URL || "/"} aria-label="Go to DEKODE home">
          DEKODE
        </a>
      </header>

      <main className="interactive-story content-container interactive-content-enabled" style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', flex: 1, width: '100%', padding: '120px 20px 4rem' }}>
          
          <div className="content-section-heading" style={{ textAlign: 'center', margin: '0 auto 2rem' }}>
            <span className="section-eyebrow" style={{ display: 'block', marginBottom: '0.5rem' }}>LEGAL</span>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'white', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
              {isPrivacy ? 'Privacy Policy' : 'Terms of Service'}
            </h1>
            <p style={{ color: 'var(--story-muted)', fontSize: '0.95rem', margin: '0 auto' }}>
              Last updated: August 2026
            </p>
          </div>

          <div className="company-info-grid" style={{ gridTemplateColumns: '1fr', display: 'block' }}>
            <section className="company-legal-switcher" style={{ margin: 0 }}>
              <article className="company-legal-content">
                <p>{document.summary}</p>
                
                {document.sections.map((section) => (
                  <div key={section.title}>
                    <h4>{section.title}</h4>
                    <p>{section.summary}</p>
                  </div>
                ))}

                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,.08)', textAlign: 'center' }}>
                  <h4 style={{ fontSize: '1.05rem', color: 'white', marginBottom: '0.4rem', marginTop: 0 }}>
                    Questions about {isPrivacy ? 'your privacy' : 'our terms'}?
                  </h4>
                  <p style={{ color: 'var(--story-muted)', fontSize: '0.9rem', marginBottom: '1.25rem', marginTop: 0 }}>
                    Please reach out to our team directly.
                  </p>
                  <a 
                    href={`mailto:${document.contactEmail || 'contactus@dekodeglobal.com'}`} 
                    className="action-pill" 
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', width: 'auto', padding: '0.6rem 1.25rem', fontSize: '0.9rem', textDecoration: 'none' }}
                  >
                    <Mail size={16} /> Contact Support
                  </a>
                </div>
              </article>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
