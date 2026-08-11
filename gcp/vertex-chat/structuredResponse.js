export const responseSchema = {
  type: 'OBJECT',
  required: ['intent', 'confidence', 'action', 'topic', 'answer'],
  properties: {
    intent: { type: 'STRING', enum: ['company_info', 'project_build', 'book_meeting', 'pricing', 'case_study', 'methodology', 'safety_refusal', 'out_of_scope', 'clarification'] },
    confidence: { type: 'NUMBER', minimum: 0, maximum: 1 },
    action: { type: 'STRING', enum: ['answer', 'open_calendar', 'show_project_panel', 'show_company_panel', 'ask_clarification', 'refuse'] },
    topic: { type: 'STRING' },
    answer: { type: 'STRING' },
    suggestions: {
      type: 'ARRAY',
      maxItems: 4,
      items: {
        type: 'OBJECT',
        required: ['label', 'prompt', 'intent', 'action'],
        properties: {
          label: { type: 'STRING' },
          prompt: { type: 'STRING' },
          intent: { type: 'STRING', enum: ['company_info', 'project_build', 'book_meeting', 'pricing', 'case_study', 'methodology', 'clarification'] },
          action: { type: 'STRING', enum: ['answer', 'open_calendar', 'show_project_panel', 'show_company_panel', 'ask_clarification'] },
        },
      },
    },
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
    suggestions: (Array.isArray(value.suggestions) ? value.suggestions : [])
      .flatMap((suggestion) => {
        const label = String(suggestion?.label || '').trim().slice(0, 42);
        const prompt = String(suggestion?.prompt || '').trim().slice(0, 180);
        const intent = responseSchema.properties.intent.enum.includes(suggestion?.intent) ? suggestion.intent : undefined;
        const action = responseSchema.properties.action.enum.includes(suggestion?.action) ? suggestion.action : undefined;
        return label && prompt
          ? [{ label, prompt, ...(intent ? { intent } : {}), ...(action ? { action } : {}) }]
          : [];
      })
      .filter((suggestion, index, items) => items.findIndex((item) => item.label.toLowerCase() === suggestion.label.toLowerCase()) === index)
      .slice(0, 4),
  };
}
