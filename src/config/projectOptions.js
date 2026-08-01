export const PROJECT_OPTIONS = [
  {
    label: "AI Strategy",
    aliases: ["ai strategy", "ai consulting", "ai roadmap"],
    openingQuestion:
      "Great place to start. Which team or business function needs the AI strategy, and what outcome should the roadmap improve?",
  },
  {
    label: "AI Automation",
    aliases: [
      "ai automation", "generative ai", "gen ai", "genai", "llm", "copilot",
      "agentic ai", "ai agent", "ai agents", "autonomous agent",
      "predictive ai", "predictive analytics", "forecasting", "prediction model",
      "analytical ai", "ai analytics", "data analysis", "decision intelligence",
      "process automation", "workflow automation", "business automation",
      "systems integration", "api integration", "software integration"
    ],
    openingQuestion:
      "Excellent choice. Are you looking to build generative AI capabilities, autonomous agents, process automation, or predictive models?",
  },
  {
    label: "Mobile & Web",
    aliases: [
      "mobile app", "ios app", "android app", "web app", "web application",
      "web portal", "mobile and web", "mobile & web", "mobile", "web", "website"
    ],
    openingQuestion:
      "A multi-platform project sounds exciting. Are we building a mobile app (iOS/Android), a web application, or both?",
  },
  {
    label: "Cloud Solutions",
    aliases: ["cloud", "cloud solution", "cloud solutions", "cloud infrastructure", "cloud migration"],
    openingQuestion:
      "Great. Which team or workload needs the cloud solution, and what reliability, scale, or security problem should it solve?",
  },
];

const normalise = (value) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9\s&+-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export function findProjectOption(message) {
  const input = normalise(message);
  return PROJECT_OPTIONS.find((option) =>
    [option.label, ...option.aliases]
      .map(normalise)
      .some((term) => input === term || input.includes(term)),
  );
}
