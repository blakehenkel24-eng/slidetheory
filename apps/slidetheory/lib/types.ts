export interface GenerateSlideRequest {
  context: string;
  keyTakeaway: string;
  slideType: string;
  audience: string;
  data?: string;
  presentationMode: "presentation" | "read";
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
}

export interface GenerateSlideResponse {
  success: boolean;
  slide?: SlideData;
  error?: string;
}
