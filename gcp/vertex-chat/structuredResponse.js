export const responseSchema = {
  type: 'OBJECT',
  required: ['intent', 'confidence', 'action', 'topic', 'answer'],
  properties: {
    intent: { type: 'STRING', enum: ['company_info', 'project_build', 'book_meeting', 'pricing', 'case_study', 'methodology', 'safety_refusal', 'out_of_scope', 'clarification'] },
    confidence: { type: 'NUMBER', minimum: 0, maximum: 1 },
    action: { type: 'STRING', enum: ['answer', 'open_calendar', 'show_project_panel', 'show_company_panel', 'ask_clarification', 'refuse'] },
    topic: { type: 'STRING' },
    answer: { type: 'STRING' },
  },
};

export function parseStructuredCompletion(text) {
  const value = JSON.parse(String(text || '').trim());
  if (!value.answer || !value.intent || !value.action) throw new Error('VERTEX_STRUCTURED_RESPONSE_INVALID');
  return {
    intent: String(value.intent),
    confidence: Math.max(0, Math.min(1, Number(value.confidence) || 0)),
    action: String(value.action),
    topic: String(value.topic || 'general').slice(0, 80),
    answer: String(value.answer).trim(),
  };
}

