import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const knowledgePath = resolve(projectRoot, 'src/knowledge/companyKnowledge.json');
const targetHtmlPaths = [
  resolve(projectRoot, 'dist/client/index.html'),
  resolve(projectRoot, 'dist/index.html'),
];

async function injectSeo() {
  try {
    const knowledgeRaw = await readFile(knowledgePath, 'utf8');
    const knowledge = JSON.parse(knowledgeRaw);

    const servicesHtml = (knowledge.services || [])
      .map(
        (s) => `
        <article>
          <h3>${s.name}</h3>
          <p>${s.summary}</p>
          ${
            s.capabilities && s.capabilities.length
              ? `<ul>${s.capabilities.map((c) => `<li>${c}</li>`).join('')}</ul>`
              : ''
          }
        </article>`
      )
      .join('\n');

    const caseStudiesHtml = (knowledge.caseStudies || [])
      .map(
        (cs) => `
        <article>
          <h3>${cs.name}</h3>
          <p><strong>Challenge:</strong> ${cs.challenge}</p>
          <p><strong>Solution:</strong> ${cs.solution}</p>
          <p><strong>Outcome:</strong> ${cs.outcome}</p>
        </article>`
      )
      .join('\n');

    const portfolioHtml = (knowledge.portfolioProjects || [])
      .map(
        (p) => `
        <article>
          <h3>${p.name}</h3>
          <p>${p.description}</p>
        </article>`
      )
      .join('\n');

    const locationsHtml = (knowledge.contact?.locations || [])
      .map(
        (loc) => `
        <div>
          <h4>${loc.country}</h4>
          <p>${loc.address}</p>
        </div>`
      )
      .join('\n');

    const seoBlock = `
    <!-- Static Semantic Content for Search Engines & Accessibility -->
    <noscript>
      <header>
        <h1>${knowledge.company.name} - Enterprise AI Strategy & Custom Software</h1>
        <p>${knowledge.company.about}</p>
        <p><strong>Mission:</strong> ${knowledge.company.mission}</p>
      </header>
      <main>
        <section>
          <h2>Our Services & Expertise</h2>
          ${servicesHtml}
        </section>
        <section>
          <h2>Case Studies & Verified Outcomes</h2>
          ${caseStudiesHtml}
        </section>
        <section>
          <h2>Featured Products & Portfolio</h2>
          ${portfolioHtml}
        </section>
        <section>
          <h2>Global Presence & Contact</h2>
          ${locationsHtml}
          <p>Email: <a href="mailto:${knowledge.contact?.email || 'contactus@dekodeglobal.com'}">${knowledge.contact?.email || 'contactus@dekodeglobal.com'}</a></p>
        </section>
      </main>
    </noscript>
    <div id="seo-crawlable-content" class="sr-only" aria-hidden="true" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;">
      <h2>DEKODE AI Solutions & Services</h2>
      <p>${knowledge.company.about}</p>
      ${servicesHtml}
      ${caseStudiesHtml}
      ${portfolioHtml}
    </div>`;

    for (const htmlPath of targetHtmlPaths) {
      try {
        let html = await readFile(htmlPath, 'utf8');
        if (html.includes('id="seo-crawlable-content"')) {
          console.log(`[SEO Injection] Already present in ${htmlPath}`);
          continue;
        }
        html = html.replace('<body>', `<body>\n${seoBlock}`);
        await writeFile(htmlPath, html, 'utf8');
        console.log(`[SEO Injection] Successfully injected semantic SEO into ${htmlPath}`);
      } catch (err) {
        // File may not exist in dist (e.g. dist/index.html moved to dist/client)
      }
    }
  } catch (error) {
    console.warn('[SEO Injection] Skipped SEO injection:', error.message);
  }
}

injectSeo();
