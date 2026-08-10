import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const indexCss = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');
const voiceCss = await readFile(new URL('../src/components/voice/voice.css', import.meta.url), 'utf8');
const chatApp = await readFile(new URL('../src/components/ChatApp.jsx', import.meta.url), 'utf8');
const backToTop = await readFile(new URL('../src/components/BackToTopButton.jsx', import.meta.url), 'utf8');
const app = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8');
const projectOptions = await readFile(new URL('../src/config/projectOptions.js', import.meta.url), 'utf8');
const animationPanel = await readFile(new URL('../src/components/AnimationPanel.jsx', import.meta.url), 'utf8');
const interactiveContent = await readFile(new URL('../src/components/InteractiveContentSections.jsx', import.meta.url), 'utf8');
const interactiveStyles = await readFile(new URL('../src/components/interactive-content.css', import.meta.url), 'utf8');
const meetingScheduler = await readFile(new URL('../src/components/MeetingScheduler.jsx', import.meta.url), 'utf8');
const bookingSummary = await readFile(new URL('../src/components/BookingSummary.jsx', import.meta.url), 'utf8');
const typewriterText = await readFile(new URL('../src/components/TypewriterText.jsx', import.meta.url), 'utf8');

test('uses dynamic viewport units and safe-area spacing for app and voice surfaces', () => {
  assert.match(indexCss, /height:\s*100dvh/);
  assert.match(indexCss, /env\(safe-area-inset-bottom\)/);
  assert.match(voiceCss, /100dvh/);
  assert.match(voiceCss, /env\(safe-area-inset-bottom\)/);
});

test('keeps one responsive visual panel and removes the fixed 600px mobile frame', () => {
  assert.equal((chatApp.match(/renderAnimationCard\('responsive-visual-panel'\)/g) || []).length, 1);
  assert.doesNotMatch(chatApp, /renderAnimationCard\('mobile-only'\)/);
  assert.doesNotMatch(indexCss, /width:\s*600px\s*!important/);
  assert.doesNotMatch(indexCss, /\bzoom\s*:/);
});

test('provides content-driven breakpoints, touch targets, and reduced motion', () => {
  assert.match(indexCss, /@media \(max-width:\s*1180px\)/);
  assert.match(indexCss, /@media \(max-width:\s*767px\)/);
  assert.match(indexCss, /@media \(max-width:\s*380px\)/);
  assert.match(indexCss, /@media \(prefers-reduced-motion:\s*reduce\)/);
  assert.match(voiceCss, /min-height:\s*44px/);
  assert.match(voiceCss, /@media \(max-height:\s*640px\) and \(orientation:\s*landscape\)/);
});

test('uses multiline keyboard-aware composers and an accessible visual-panel control', () => {
  assert.match(chatApp, /<textarea/);
  assert.match(chatApp, /requestSubmit\(\)/);
  assert.match(chatApp, /aria-label=\{isVisualPanelExpanded/);
  assert.match(chatApp, /max-height:\s*640px/);
});

test('keeps the composer responsive with rotating hints and separate voice typing', () => {
  assert.match(chatApp, /placeholderMessages\[placeholderIndex\]/);
  assert.match(chatApp, /Start voice typing/);
  assert.match(chatApp, /Stop voice typing/);
  assert.match(chatApp, /BrowserSpeechToTextProvider/);
  assert.match(chatApp, /<DekodeVoiceEntry compact onClick=\{handleOpenDekodeVoice\}/);
  assert.match(chatApp, /const handleOpenDekodeVoice = \(\) =>/);
  assert.match(chatApp, /onClick=\{handleSpeech\}/);
  assert.doesNotMatch(chatApp, /<DekodeVoiceEntry onClick=/);
  assert.match(indexCss, /\.hero-title\s*\{[^}]*font-size:\s*clamp\(1\.65rem,\s*2\.4vw,\s*2\.2rem\)[^}]*max-width:\s*min\(1120px,\s*100%\)/s);
  assert.match(indexCss, /@media \(min-width:\s*901px\)[\s\S]*\.hero-title\s*\{[^}]*white-space:\s*nowrap/s);
  assert.match(chatApp, /className="action-pill proposal-entry-button client-portal-top-right"/);
  assert.match(chatApp, /className="action-pill calendar-entry-button"/);
  assert.match(chatApp, /aria-label="Book a meeting"/);
  assert.match(chatApp, /setStep\('scheduling'\)/);
  assert.match(chatApp, /result\.action === "open_calendar"/);
  assert.match(chatApp, /activateMeetingScheduler\(\)/);
  assert.match(chatApp, /> Client Portal/);
  assert.doesNotMatch(chatApp, /Access Client Portal|Access client proposal/);
  assert.equal((projectOptions.match(/label:\s*"/g) || []).length, 4);
  assert.match(indexCss, /\.option-row\s*\{[^}]*flex-wrap:\s*nowrap/s);
  assert.match(indexCss, /@media \(min-width:\s*768px\) and \(max-width:\s*1100px\)/);
  assert.match(indexCss, /@media \(max-width:\s*767px\)[\s\S]*\.option-row/s);
  assert.match(indexCss, /\.proposal-entry-button\s*\{[^}]*white-space:\s*nowrap/s);
  assert.match(indexCss, /\.chat-mic-btn\s*\{[^}]*width:\s*44px[^}]*height:\s*44px/s);
  assert.match(indexCss, /\.contact-panel-grid \.knowledge-panel-button span,[\s\S]*overflow-wrap:\s*anywhere/);
});

test('caps long answer reveal time instead of typing every character slowly', () => {
  assert.match(typewriterText, /maxAnimationDuration = 1800/);
  assert.match(typewriterText, /charactersPerTick/);
  assert.match(typewriterText, /text\.slice\(0, nextIndex\)/);
});

test('switches legal documents in one shared panel and tightens story spacing', () => {
  assert.match(interactiveContent, /activeLegalDocument/);
  assert.match(interactiveContent, /role="tablist"/);
  assert.match(interactiveContent, /role="tabpanel"/);
  assert.doesNotMatch(interactiveContent, /<details/);
  assert.match(interactiveStyles, /\.company-legal-toggle/);
  assert.match(interactiveStyles, /padding: clamp\(3rem, 6vw, 5\.5rem\) 0/);
  assert.match(interactiveStyles, /min-height: 380px/);
});

test('pauses rotating hints for active voice typing states', () => {
  assert.match(chatApp, /\['requesting', 'listening', 'processing'\]\.includes\(voiceTypingState\)/);
  assert.match(chatApp, /data-state=\{voiceTypingState\}/);
});

test('renders composer inspiration only on the home screen', () => {
  assert.match(chatApp, /step !== "centered"/);
  assert.match(chatApp, /step === "centered" && !inputValue && !readOnly/);
  assert.doesNotMatch(chatApp, /Message DEKODE|active-chat-placeholder/);
});

test('provides one translucent back-to-top control across every DEKODE layout', () => {
  assert.match(app, /<BackToTopButton key=\{proposal \? 'proposal' : 'site'\}/);
  assert.match(backToTop, /\.app-container, \.chat-scroll-area, \.proposal-source-stage/);
  assert.match(backToTop, /document\.addEventListener\('scroll', handleScroll, true\)/);
  assert.match(backToTop, /aria-label="Back to top"/);
  assert.match(backToTop, /reduceMotion \? 'auto' : 'smooth'/);
  assert.match(indexCss, /\.back-to-top-button\s*\{[^}]*width:\s*44px[^}]*height:\s*44px/s);
  assert.match(indexCss, /right:\s*calc\(32px \+ env\(safe-area-inset-right, 0px\)\)/);
  assert.match(indexCss, /bottom:\s*calc\(32px \+ env\(safe-area-inset-bottom, 0px\)\)/);
  assert.match(indexCss, /right:\s*calc\(20px \+ env\(safe-area-inset-right, 0px\)\)/);
  assert.match(indexCss, /background:\s*rgba\(5, 51, 100, 0\.72\)/);
});

test('guides booking from date to time, summary, and details', () => {
  assert.match(meetingScheduler, /30 minutes with the DEKODE team/);
  assert.match(meetingScheduler, /meeting-duration-chip/);
  assert.match(meetingScheduler, /30 min · Video call/);
  assert.doesNotMatch(meetingScheduler, /Step 1|Step 2|Steps 3 and 4/);
  assert.match(meetingScheduler, /id="meeting-calendar-title">Choose a date/);
  assert.match(meetingScheduler, /className="meeting-date-rail"/);
  assert.match(meetingScheduler, /dateRailDays\.map/);
  assert.doesNotMatch(meetingScheduler, /Calendar month|Calendar year|Previous month|Next month|ChevronLeft|ChevronRight/);
  assert.match(meetingScheduler, /className=\{`meeting-scheduler \$\{activeSelectedDateKey \? 'has-selected-date' : ''\}`\}/);
  assert.match(indexCss, /\.meeting-date-rail,[\s\S]*\.meeting-time-rail\s*\{[^}]*overflow-x:\s*auto/);
  assert.match(indexCss, /\.meeting-time-rail button\s*\{[^}]*border-radius:\s*999px[^}]*box-shadow:/);
  assert.match(indexCss, /\.meeting-date-rail button\s*\{[^}]*border-radius:\s*999px[^}]*box-shadow:/);
  assert.match(indexCss, /\.meeting-booking-fields input:not\(\[type="checkbox"\]\)\s*\{[^}]*border-radius:\s*999px/);
  assert.match(indexCss, /\.meeting-booking-fields textarea\s*\{[^}]*border-radius:\s*18px/);
  assert.match(indexCss, /\.meeting-floating-field:focus-within > span/);
  assert.match(indexCss, /:has\(input:not\(:placeholder-shown\)\)/);
  assert.match(meetingScheduler, /placeholder=" "/);
  assert.match(meetingScheduler, /disabled=\{!hasSlots\}/);
  assert.match(meetingScheduler, /activeSelectedDateKey && status !== 'loading'/);
  assert.match(meetingScheduler, /selectedDateSlots\.map/);
  assert.match(meetingScheduler, /\.sort\(\(left, right\) => Date\.parse\(left\.iso\) - Date\.parse\(right\.iso\)\)/);
  assert.match(meetingScheduler, /const firstAvailableDateKey = nextSlots\.map/);
  assert.match(meetingScheduler, /if \(firstAvailableDateKey\) selectDate\(firstAvailableDateKey\)/);
  assert.match(meetingScheduler, /slots\.length > 0 && \(/);
  assert.match(meetingScheduler, /className=\{`meeting-details-stage \$\{selectedSlot \? 'is-unlocked' : 'is-locked'\}`\}/);
  assert.match(meetingScheduler, /<fieldset className="meeting-booking-fields" disabled=\{!selectedSlot\}/);
  assert.match(meetingScheduler, /Choose a time to unlock/);
  assert.match(indexCss, /\.meeting-details-stage\.is-locked \.meeting-booking-fields\s*\{[^}]*pointer-events:\s*none/);
  assert.match(meetingScheduler, /Review and complete your details/);
  assert.doesNotMatch(meetingScheduler, /Company <small>\(optional\)<\/small>/);
  assert.match(meetingScheduler, /<span>Company<\/span><input required/);
  assert.match(meetingScheduler, /<span>Phone number<\/span><input required type="tel"/);
  assert.match(chatApp, /meetingSlots=\{meetingSlots\}/);
  assert.match(chatApp, /selectedDateKey=\{selectedMeetingDateKey\}/);
  assert.match(chatApp, /selectedSlotId=\{selectedMeetingSlotId\}/);
  assert.match(meetingScheduler, /onSlotsChange\?\.\(nextSlots\)/);
  assert.match(meetingScheduler, /onSlotSelect\?\.\(slot\)/);
  assert.match(animationPanel, /<BookingSummary/);
  assert.match(bookingSummary, /No meeting selected yet/);
  assert.match(bookingSummary, /Choose an available time/);
});

test('communicates availability, timezone conversion, progress, and mobile ordering', () => {
  assert.match(meetingScheduler, /Mon-Fri/);
  assert.match(meetingScheduler, /9:00-17:00/);
  assert.match(meetingScheduler, /Shown in/);
  assert.match(indexCss, /\.meeting-availability-card\s*\{[^}]*display:\s*flex[^}]*border-radius:\s*10px/s);
  assert.match(bookingSummary, /Your timezone/);
  assert.match(bookingSummary, /Company timezone/);
  assert.match(bookingSummary, /progressLabels = \['Choose date', 'Choose time', 'Details', 'Confirm'\]/);
  assert.match(meetingScheduler, /className="meeting-mobile-summary"/);
  assert.ok(meetingScheduler.indexOf('className={`meeting-details-stage') < meetingScheduler.indexOf('className="meeting-mobile-summary"'));
  assert.match(indexCss, /\.meeting-mobile-summary\s*\{\s*display:\s*none/);
  assert.match(indexCss, /@media \(max-width:\s*767px\)[\s\S]*\.meeting-mobile-summary\s*\{\s*display:\s*block/s);
  assert.match(indexCss, /\.is-booking-layout \.booking-summary-panel\s*\{\s*display:\s*none/);
  assert.ok(indexCss.indexOf('.meeting-date-rail button:disabled') < indexCss.indexOf('.meeting-date-rail button.is-today'));
});

test('keeps booking controls accessible and motion-sensitive', () => {
  assert.match(meetingScheduler, /aria-pressed=\{activeSelectedDateKey === dateKey\}/);
  assert.match(meetingScheduler, /aria-pressed=\{selectedSlot\?\.id === slot\.id\}/);
  assert.match(meetingScheduler, /requestAnimationFrame/);
  assert.match(meetingScheduler, /useReducedMotion/);
  assert.match(bookingSummary, /aria-live="polite"/);
  assert.match(indexCss, /\.meeting-date-rail button:focus-visible/);
  assert.match(indexCss, /\.meeting-time-rail button:focus-visible/);
});

test('keeps consent aligned and resumes normal chat after booking', () => {
  assert.match(indexCss, /\.meeting-consent\s*\{[^}]*align-items:\s*center/);
  assert.match(indexCss, /\.meeting-consent input\s*\{[^}]*margin:\s*0/);
  assert.match(chatApp, /const needsIntentRouting = \["centered", "triage", "company", "scheduling", "done"\]\.includes\(step\)/);
  assert.match(chatApp, /step === "scheduling" \|\| step === "done"/);
  assert.match(chatApp, /startConversation\(userMessage, true\)/);
  assert.doesNotMatch(chatApp, /readOnly:\s*step === "scheduling"/);
  assert.doesNotMatch(chatApp, /if \(step === "scheduling" \|\| isTyping\) return/);
  assert.match(chatApp, /if \(step === "centered" \|\| step === "done"\) setStep\("company"\)/);
  assert.match(chatApp, /We have sent the invitation and meeting details to your email/);
  assert.doesNotMatch(chatApp, /Google Calendar has sent the invitation/);
});

test('removes obsolete numbered progress from dynamic project conversations', () => {
  assert.doesNotMatch(chatApp, /showDiscoveryProgress/);
  assert.doesNotMatch(chatApp, /className="step-dot"/);
});

test('opens the existing scheduler from an AI qualification action', () => {
  assert.match(chatApp, /action\.type === "open_booking"/);
  assert.match(chatApp, /handleOpenMeetingScheduler\(\)/);
  assert.match(chatApp, /conversation: requestConversation/);
  assert.match(chatApp, /setConversationMemory\(result\.conversation\)/);
  assert.match(animationPanel, /conversationSummary/);
});
