export const interactiveSiteContent = {
  capabilities: [
    {
      id: "ai-strategy",
      title: "AI Strategy & Consulting",
      shortDescription: "Turn AI uncertainty into a clear, practical roadmap.",
      fullDescription:
        "DEKODE identifies useful AI opportunities, prioritises use cases, reviews data and workflows, and builds a roadmap grounded in responsible adoption.",
      value: "Best for teams exploring AI or needing a clearer direction.",
      keywords: ["AI roadmap", "responsible AI", "opportunity mapping"],
      chatPrompt: "Tell me how DEKODE can help shape an AI strategy for my business.",
      sourceReference: "DEKODE/src/pages/Services.jsx#ai-strategy",
    },
    {
      id: "custom-ai",
      title: "Custom AI Development",
      shortDescription: "Purpose-built AI that fits real business workflows.",
      fullDescription:
        "From machine learning and generative AI to internal copilots, search and knowledge systems, DEKODE develops AI around a specific operational need.",
      value: "Useful when an off-the-shelf tool does not fit the problem.",
      keywords: ["generative AI", "machine learning", "internal copilots"],
      chatPrompt: "I want to discuss a custom AI solution with DEKODE.",
      sourceReference: "DEKODE/src/pages/Services.jsx#custom-ai",
    },
    {
      id: "web-mobile",
      title: "Web & Mobile Development",
      shortDescription: "Apps, portals and interfaces people actually adopt.",
      fullDescription:
        "DEKODE designs and develops web apps, iOS and Android apps, dashboards and internal tools with user experience at the centre.",
      value: "From rapid prototype through to production-ready delivery.",
      keywords: ["web apps", "mobile apps", "UX/UI"],
      chatPrompt: "Help me explore a web or mobile product with DEKODE.",
      sourceReference: "DEKODE/src/pages/Services.jsx#web-mobile",
    },
    {
      id: "ecommerce",
      title: "AI-Powered E-Commerce Solutions",
      shortDescription: "AI-powered shopping experiences that convert and scale.",
      fullDescription:
        "DEKODE delivers AI-powered e-commerce solutions with personalisation, intelligent search, workflow automation, and scalable architecture.",
      value: "For retailers and brands launching or upgrading online.",
      keywords: ["e-commerce", "personalisation", "intelligent search"],
      chatPrompt: "Tell me how DEKODE could deliver an AI-powered e-commerce solution.",
      sourceReference: "DEKODE/src/pages/Services.jsx#ecommerce",
    },
    {
      id: "automation",
      title: "Integration & Automation",
      shortDescription: "Connect systems and remove repetitive manual work.",
      fullDescription:
        "DEKODE provides integration and automation across platforms, APIs, and business processes in operations, finance, and support.",
      value: "For disconnected tools, manual workflows or fragile integrations.",
      keywords: ["APIs", "integrations", "business automation"],
      chatPrompt: "I want to discuss integration and workflow automation.",
      sourceReference: "DEKODE/src/pages/Services.jsx#integrations",
    },
    {
      id: "cloud-security",
      title: "Cloud, Security & Managed IT Solutions",
      shortDescription: "Secure, scalable, managed foundations built for reliability.",
      fullDescription:
        "DEKODE delivers cloud, security, and managed IT solutions spanning strategy, migration, infrastructure, identity and access, data protection, hardening, and ongoing management.",
      value: "For stable, secure systems without a full in-house IT team.",
      keywords: ["AWS", "Azure", "GCP", "managed IT", "security"],
      chatPrompt: "I want to discuss cloud, security, and managed IT solutions.",
      sourceReference: "DEKODE/src/pages/Services.jsx#cloud-it",
    },
  ],
  selectedWork: [
    {
      id: "food-manufacturing",
      title: "Food Manufacturing Company",
      industry: "Food Manufacturing",
      challenge:
        "A paper-based production system made information difficult to find, limited operational visibility and increased manual reporting effort.",
      approach:
        "DEKODE worked with the client to understand operating gaps, designed a cloud-based information capture system, prototyped it, then iterated with regular feedback.",
      solution:
        "An electronic information capture and production management system on Microsoft Azure.",
      outcome:
        "The client reduced manual effort and associated costs by 20% in Phase 1, while gaining faster operational feedback.",
      relatedCapability: "Integration & Automation",
      chatPrompt:
        "I want to discuss a project similar to DEKODE's food manufacturing production system.",
      sourceReference: "DEKODE/src/pages/FoodManufacture.jsx",
    },
    {
      id: "primary-school",
      title: "Primary School",
      industry: "Education",
      challenge:
        "Paper-based administration made records difficult to store, locate, archive and report, adding time and administrative overhead.",
      approach:
        "DEKODE helped move visitor, child movement, staff and incident records into an automated information system.",
      solution: "AttendMe, a cloud-based management system on AWS.",
      outcome:
        "The school reduced administrative overhead, improved record access and reporting, and supported a safer environment for children.",
      relatedCapability: "Web & Mobile Development",
      chatPrompt:
        "I want to discuss a project similar to DEKODE's school administration system.",
      sourceReference: "DEKODE/src/pages/PrimarySchool.jsx",
    },
  ],
  deliveryProcess: [
    {
      id: "discovery",
      title: "Discovery",
      description: "Align on goals, users, constraints, workflows, and the outcomes that will define success.",
      question: "What problem or opportunity are you trying to understand?",
      chatPrompt: "Help me discover and clarify the problem my project should solve.",
    },
    {
      id: "prototype",
      title: "Prototype",
      description: "Turn the strongest direction into something tangible so assumptions, user flows, and technical choices can be tested early.",
      question: "What should we test before committing to a full build?",
      chatPrompt: "Help me turn my project idea into a testable prototype.",
    },
    {
      id: "design",
      title: "Design",
      description: "Define the solution architecture, user experience, delivery plan, and measures of success.",
      question: "What should a successful experience look like for your users?",
      chatPrompt: "Help me define the solution and user experience for my project.",
    },
    {
      id: "build",
      title: "Build",
      description: "Implement, integrate, test, and document the solution with security and maintainability built in throughout.",
      question: "What needs to work in the first useful release?",
      chatPrompt: "Help me identify what belongs in the first useful release.",
    },
    {
      id: "deploy",
      title: "Deploy",
      description: "Release the production-ready solution with a practical rollout, operational readiness, and support plan.",
      question: "What does a successful launch need?",
      chatPrompt: "Help me plan a practical production rollout for my project.",
    },
    {
      id: "evolve",
      title: "Evolve",
      description: "Monitor what was shipped, support users, learn from real usage, and improve the product over time.",
      question: "How should the solution improve after launch?",
      chatPrompt: "Tell me how DEKODE supports and improves solutions after launch.",
    },
  ],
  industries: [
    {
      id: "education",
      title: "Education",
      challenge: "Administrative load, fragmented records and workflows that are difficult to manage.",
      capabilities: ["Web & Mobile", "Automation", "Cloud"],
      solution: "Accessible digital tools and connected information workflows.",
      chatPrompt: "I want to discuss a digital solution for education.",
    },
    {
      id: "healthcare",
      title: "Healthcare",
      challenge: "Sensitive information and workflows that need clarity, reliability and security.",
      capabilities: ["Secure Cloud", "Automation", "Digital Products"],
      solution: "Security-first systems designed around real operational needs.",
      chatPrompt: "I want to discuss a secure digital solution for healthcare.",
    },
    {
      id: "finance",
      title: "Finance & Accounting",
      challenge: "Manual processes, disconnected data and complex customer journeys.",
      capabilities: ["AI", "Integrations", "Web & Mobile"],
      solution: "Connected tools that streamline decisions and customer workflows.",
      chatPrompt: "I want to discuss a finance or accounting technology solution.",
    },
    {
      id: "legal",
      title: "Legal",
      challenge: "Knowledge-heavy work, document workflows and responsible information handling.",
      capabilities: ["AI Strategy", "Knowledge Systems", "Security"],
      solution: "Practical AI and secure workflow tools with governance built in.",
      chatPrompt: "I want to discuss a responsible technology solution for legal work.",
    },
    {
      id: "food-agriculture",
      title: "Food & Agriculture",
      challenge: "Paper-based operations and limited visibility across production processes.",
      capabilities: ["Automation", "Cloud", "Data Platforms"],
      solution: "Digital information capture and operational management systems.",
      chatPrompt: "I want to discuss an operations solution for food or agriculture.",
    },
    {
      id: "retail",
      title: "Retail",
      challenge: "Disconnected commerce, inventory and customer experiences.",
      capabilities: ["E-Commerce", "AI", "Integrations"],
      solution: "Scalable commerce experiences with intelligent search and automation.",
      chatPrompt: "I want to discuss a retail or e-commerce solution.",
    },
  ],
  conversionPrompts: {
    start: "I have an idea and want to tell DEKODE what I am building.",
    meeting: "I would like to request a meeting about my project.",
  },
};

