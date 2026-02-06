export type SlideType = 
  | "auto"
  | "Executive Summary"
  | "Horizontal Flow"
  | "Vertical Flow"
  | "Graph / Chart"
  | "General";

export type Audience = 
  | "auto"
  | "C-Suite / Board"
  | "External Client"
  | "Internal / Working Team"
  | "PE / Investors";

export type PresentationMode = "presentation" | "read";

export interface GenerateSlideRequest {
  slideType: SlideType;
  context: string;
  audience: Audience;
  keyTakeaway: string;
  presentationMode: PresentationMode;
  dataInput?: string;
}

export interface SlideData {
  id: string;
  userId?: string;
  slideType: SlideType;
  audience: Audience;
  context: string;
  keyTakeaway: string;
  presentationMode: PresentationMode;
  dataInput?: string;
  imageUrl?: string;
  htmlContent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GenerateSlideResponse {
  success: boolean;
  slide?: SlideData;
  imageUrl?: string;
  htmlContent?: string;
  error?: string;
}

// Updated slide types based on consulting archetypes from PROMPT_INSTRUCTIONS.md
export const SLIDE_TYPES: { value: SlideType; label: string; description: string }[] = [
  {
    value: "auto",
    label: "Auto-select",
    description: "Let AI choose the best slide type based on your content",
  },
  {
    value: "Executive Summary",
    label: "Executive Summary",
    description: "Pyramid principle: so-what first with 3-4 supporting bullets",
  },
  {
    value: "Horizontal Flow",
    label: "Horizontal Flow",
    description: "Process steps, timeline, or sequence - left to right flow",
  },
  {
    value: "Vertical Flow",
    label: "Vertical Flow",
    description: "Issue tree or breakdown - top-down MECE hierarchy",
  },
  {
    value: "Graph / Chart",
    label: "Graph / Chart",
    description: "Data visualization with clear axes, labels, and insight callouts",
  },
  {
    value: "General",
    label: "General",
    description: "Flexible format based on content and context",
  },
];

// Updated audiences per PROMPT_INSTRUCTIONS.md
export const AUDIENCES: { value: Audience; label: string; description: string }[] = [
  {
    value: "auto",
    label: "Auto-select",
    description: "Let AI determine the best tone based on your context"
  },
  { 
    value: "C-Suite / Board", 
    label: "C-Suite / Board",
    description: "Strategic focus, high-level insights, action-oriented"
  },
  { 
    value: "PE / Investors", 
    label: "PE / Investors",
    description: "Financial metrics, growth potential, risk-return"
  },
  { 
    value: "External Client", 
    label: "External Client",
    description: "Professional, polished, value proposition focused"
  },
  { 
    value: "Internal / Working Team", 
    label: "Internal / Working Team",
    description: "Detailed, collaborative, implementation focused"
  },
];
