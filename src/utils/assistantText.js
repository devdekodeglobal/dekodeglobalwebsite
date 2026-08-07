export function cleanAssistantText(value) {
  return String(value ?? '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/^#{1,6}\s+(.+)$/gm, '**$1**')
    .replace(/__(.*?)__/g, '**$1**')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*[ \t]*\*\*/g, '')
    .trim();
}
