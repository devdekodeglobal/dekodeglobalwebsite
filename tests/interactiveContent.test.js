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
    "The DEKODE standard",
    "Capabilities",
    "Success stories",
    "Methodology",
    'eyebrow="Services"',
    "Contact, locations and policies",
  ]) assert.match(sections, new RegExp(label.replace(/[?]/g, "\\?")));
  assert.match(sections, /activeCapability/);
  assert.match(sections, /activeProject/);
  assert.match(sections, /activeStage/);
  assert.match(sections, /activeIndustry/);
  assert.ok(sections.indexOf('Start a project') < sections.indexOf('Capabilities'));
  assert.ok(sections.indexOf('Capabilities') < sections.indexOf('Success stories'));
  assert.ok(sections.indexOf('Success stories') < sections.indexOf('Methodology'));
  assert.doesNotMatch(sections, /Built for adoption, not applause/);
});

test("structured content is sourced and responsive fallbacks are available", () => {
  assert.match(content, /sourceReference/);
  assert.match(content, /capabilities:/);
  assert.match(content, /selectedWork:/);
  assert.doesNotMatch(content, /CHAUFFR/);
  assert.match(content, /deliveryProcess:/);
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

test("mobile STAR content uses a cylindrical carousel and compact actions", () => {
  assert.match(sections, /className="star-cylinder-stage"/);
  assert.match(sections, /drag=\{shouldReduceMotion \? false : "x"\}/);
  assert.match(sections, /onDragEnd=\{handleStarDragEnd\}/);
  assert.match(sections, /ArrowLeft/);
  assert.match(sections, /ArrowRight/);
  assert.match(sections, /star-carousel-status/);
  assert.match(css, /perspective:\s*900px/);
  assert.match(css, /transform-style:\s*preserve-3d/);
  assert.match(css, /rotateY\(calc\(var\(--star-position\) \* 90deg\)\) translateZ\(148px\)/);
  assert.match(css, /\.conversion-actions\s*\{[^}]*width:\s*min\(100% - 1\.5rem, 19rem\)/s);
  assert.match(css, /\.capability-switcher,[\s\S]*flex-wrap:\s*wrap;[\s\S]*overflow:\s*visible/);
});
