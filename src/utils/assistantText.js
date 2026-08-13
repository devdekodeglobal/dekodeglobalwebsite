export function normalizeAssistantLists(value) {
  return String(value ?? '')
    .replace(/\r\n?/g, '\n')
    .replace(/â€¢|\u2022/g, '-')
    .replace(/([^\n])\s+(?=(?:\*|-|\d+[.)])\s+(?:\*\*|[A-Z0-9]))/g, '$1\n')
    .replace(/^\s*\*\s+(?=\S)/gm, '- ')
    .replace(/^\s*-\s+/gm, '- ')
    .replace(/\n{3,}/g, '\n\n');
}

export function cleanAssistantText(value) {
  return normalizeAssistantLists(String(value ?? '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/^#{1,6}\s+(.+)$/gm, '**$1**')
    .replace(/__(.*?)__/g, '**$1**')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*[ \t]*\*\*/g, ''))
    .trim();
}

export function buildCleanProjectSummary(messages = []) {
  if (!Array.isArray(messages) || messages.length === 0) return '';

  const IGNORE_PATTERNS = /^(hi|hello|hey|ok|yes|no|thanks|thank you|(?:let'?s\s+)?(?:i\s+)?(?:rather|want|would like|prefer)?\s*(?:to\s+)?(?:do\s+this\s+on\s+a\s+|book\s+a\s+|schedule\s+a\s+|a\s+)?(?:call|meeting|talk)(?:\s+be\s+nice)?)$/i;

  const relevantInputs = messages
    .filter((m) => m.sender === 'user' && m.text)
    .map((m) => m.text.trim())
    .filter((text) => !IGNORE_PATTERNS.test(text));

  if (relevantInputs.length === 0) {
    return 'Discovery call inquiry regarding DEKODE services.';
  }

  const topics = [...new Set(
    messages
      .filter((m) => m.sender === 'ai' && m.topic)
      .map((m) => m.topic)
  )];

  const topicPrefix = topics.length > 0 ? `Topics discussed: ${topics.join(', ')}. ` : '';
  const requirements = relevantInputs.join(' → ');

  return `${topicPrefix}Visitor requirements: ${requirements}`.slice(0, 1500);
}

