import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const chat = await readFile(new URL("../src/components/ChatApp.jsx", import.meta.url), "utf8");
const sections = await readFile(new URL("../src/components/InteractiveContentSections.jsx", import.meta.url), "utf8");
const content = await readFile(new URL("../src/content/interactiveSiteContent.js", import.meta.url), "utf8");
const css = await readFile(new URL("../src/components/interactive-content.css", import.meta.url), "utf8");

test("feature flag preserves the original chat-only render path", () => {
  assert.match(app, /VITE_INTERACTIVE_CONTENT_SECTIONS_ENABLED !== 'false'/);
  assert.match(app, /INTERACTIVE_CONTENT_SECTIONS_ENABLED &&/);
  assert.match(app, /lazy\(/);
});

test("content actions bridge into the existing composer without auto-send", () => {
  assert.match(chat, /subscribeToContentChat/);
  assert.match(chat, /setInputValue\(prompt\)/);
  assert.match(chat, /composerRef\.current\?\.focus/);
  assert.doesNotMatch(chat, /startConversation\(prompt/);
  assert.match(sections, /sendContentToChat/);
});

test("all requested story sections and state controls are present", () => {
  for (const label of [
    "Start a project",
    "companyKnowledge.company.belief",
    "companyKnowledge.company.about",
    "The STAR standard",
    "What we deliver",
    "Success stories",
    "How we work",
    'eyebrow="Services"',
    "Contact, locations and policies",
  ]) assert.match(sections, new RegExp(label.replace(/[?]/g, "\\?")));
  assert.match(sections, /activeCapability/);
  assert.match(sections, /activeProject/);
  assert.match(sections, /activeStage/);
  assert.match(sections, /activeIndustry/);
  assert.ok(sections.indexOf('Start a project') < sections.indexOf('What we deliver'));
  assert.ok(sections.indexOf('What we deliver') < sections.indexOf('Success stories'));
  assert.ok(sections.indexOf('Success stories') < sections.indexOf('How we work'));
  assert.doesNotMatch(sections, /Built for adoption, not applause/);
  assert.match(sections, /Every stage earns the next one before you invest on it\./);
  assert.doesNotMatch(sections, /<small>\{item\.description\}<\/small>/);
});

test("structured content is sourced and responsive fallbacks are available", () => {
  assert.match(content, /sourceReference/);
  assert.match(content, /capabilities:/);
  assert.match(content, /selectedWork:/);
  assert.doesNotMatch(content, /CHAUFFR/);
  assert.match(content, /deliveryProcess:/);
  assert.match(content, /title: "AI-Powered E-Commerce Solutions"/);
  assert.match(content, /title: "Integration & Automation"/);
  assert.match(content, /title: "Cloud, Security & Managed IT Solutions"/);
  assert.doesNotMatch(content, /title: "E-Commerce \+ AI"|title: "Integrations \+ Automation"|title: "Cloud, IT \+ Security"/);
  assert.match(content, /title: "Discovery"[\s\S]*title: "Prototype"[\s\S]*title: "Design"[\s\S]*title: "Build"[\s\S]*title: "Deploy"[\s\S]*title: "Evolve"/);
  assert.doesNotMatch(content, /title: "Secure"|title: "Run & Optimise"/);
  assert.match(content, /industries:/);
  assert.doesNotMatch(content, /CHAUFFR/);
  assert.match(sections, /companyKnowledge\.legal/);
  assert.match(sections, /companyKnowledge\.contact\.locations/);
  assert.match(sections, /role="tablist"/);
  assert.match(sections, /aria-selected=\{isActive\}/);
  assert.match(sections, /setActiveLegalDocument\(type\)/);
  assert.doesNotMatch(sections, /<details/);
  assert.match(css, /@media \(max-width: 600px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /content-visibility:\s*auto/);
}
);

test("mobile content uses cover flow navigation", () => {
  assert.match(sections, /className="star-coverflow-track"/);
  assert.doesNotMatch(sections, /Current stage|CheckCircle2/);
  assert.doesNotMatch(sections, /Selected capability|Sparkles|capability-detail-mark/);
  assert.match(css, /\.conversion-actions\s*\{[^}]*width:\s*min\(100% - 1\.5rem, 19rem\)/s);
  assert.match(css, /\.story-section\s*\{[^}]*text-align:\s*left/s);
  assert.match(css, /\.star-section \.content-section-heading\s*\{[^}]*text-align:\s*center/s);
  assert.match(css, /\.stacked-card-rail\s*\{[^}]*overflow-x:\s*auto[^}]*scroll-snap-type:\s*x mandatory/s);
  assert.match(css, /\.methodology-detail\s*\{[^}]*align-items:\s*flex-start[^}]*border-top:\s*3px solid/s);
  assert.match(css, /\.peek-content \.content-chat-action\s*\{[^}]*min-height:\s*34px[^}]*font-size:\s*0\.7rem/s);
  assert.doesNotMatch(css, /\.capability-peek-content \.content-chat-action\s*\{/);
});
