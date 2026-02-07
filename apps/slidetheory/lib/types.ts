// Form types
export type SlideType = "auto" | "executive-summary" | "issue-tree" | "2x2-matrix" | "waterfall" | "process-flow" | "comparison";
export type Audience = "auto" | "c-suite" | "board" | "investors" | "working-team" | "clients";
export type PresentationMode = "presentation" | "read";

export const SLIDE_TYPES = [
  { value: "auto" as SlideType, label: "Auto-select", description: "Let AI choose the best slide type" },
  { value: "executive-summary" as SlideType, label: "Executive Summary", description: "High-level overview with key takeaways" },
  { value: "issue-tree" as SlideType, label: "Issue Tree", description: "Break down complex problems logically" },
  { value: "2x2-matrix" as SlideType, label: "2x2 Matrix", description: "Compare options on two dimensions" },
  { value: "waterfall" as SlideType, label: "Waterfall", description: "Show progression or breakdown" },
  { value: "process-flow" as SlideType, label: "Process Flow", description: "Step-by-step workflow" },
  { value: "comparison" as SlideType, label: "Comparison", description: "Side-by-side analysis" },
];

export const AUDIENCES = [
  { value: "auto" as Audience, label: "Auto-select", description: "Let AI determine the best tone" },
  { value: "c-suite" as Audience, label: "C-Suite", description: "Strategic, high-level, action-focused" },
  { value: "board" as Audience, label: "Board", description: "Governance, oversight, risk-focused" },
  { value: "investors" as Audience, label: "Investors", description: "Financial, growth, return-focused" },
  { value: "working-team" as Audience, label: "Working Team", description: "Detailed, tactical, implementation-focused" },
  { value: "clients" as Audience, label: "Clients", description: "Professional, persuasive, benefit-focused" },
];

// API types
export interface GenerateSlideRequest {
  context: string;
  keyTakeaway: string;
  slideType: string;
  audience: string;
  data?: string;
  presentationMode: PresentationMode;
}

export interface SlideBlueprint {
  title: string;
  subtitle?: string;
  layout: string;
  keyMessage: string;
  supportingPoints: string[];
  dataHighlights?: Array<{ metric: string; context: string }>;
  visualElements?: {
    chartType?: string;
    calloutBoxes?: string[];
    icons?: string[];
  };
  slideStructure?: {
    header?: string;
    subheader?: string;
    mainContent?: string;
    footer?: string;
  };
  imagePrompt?: string;
}

export interface SlideData {
  id: string;
  title: string;
  content: string;
  layout: string;
  blueprint?: SlideBlueprint;
  imageData?: string;
  generatedAt?: string;
  qualityAssessment?: {
    overall: number;
    dimensions: {
      actionTitle: number;
      meceStructure: number;
      pyramidPrinciple: number;
      dataQuality: number;
      soWhat: number;
      visualClarity: number;
    };
    isExecutiveReady: boolean;
    strengths: string[];
    improvements: string[];
  };
}

export interface GenerateSlideResponse {
  success: boolean;
  slide?: SlideData;
  error?: string;
}
