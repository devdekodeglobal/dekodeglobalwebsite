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
