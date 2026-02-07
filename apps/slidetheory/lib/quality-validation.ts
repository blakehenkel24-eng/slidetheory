import { SlideBlueprint } from "./types";

/**
 * Quality validation system for SlideTheory
 * Validates AI-generated slides against consulting standards
 */

export interface QualityDimensions {
  actionTitle: number;      // 1-4: Is title action-oriented with insight?
  meceStructure: number;    // 1-4: Are categories MECE?
  pyramidPrinciple: number; // 1-4: Top-down structure?
  dataQuality: number;      // 1-4: Data supported and formatted?
  soWhat: number;           // 1-4: Every point has implication?
  visualClarity: number;    // 1-4: Clean, professional design?
}

export interface QualityAssessment {
  overall: number;
  dimensions: QualityDimensions;
  isExecutiveReady: boolean;
  strengths: string[];
  improvements: string[];
}

export interface ValidationIssue {
  severity: "error" | "warning" | "info";
  dimension: keyof QualityDimensions;
  message: string;
  suggestion?: string;
}

/**
 * Validates a slide blueprint against consulting standards
 */
export function validateSlideQuality(blueprint: SlideBlueprint): {
  assessment: QualityAssessment;
  issues: ValidationIssue[];
} {
  const issues: ValidationIssue[] = [];
  const dimensions: Partial<QualityDimensions> = {};

  // 1. Action Title Validation
  const titleValidation = validateActionTitle(blueprint.title);
  dimensions.actionTitle = titleValidation.score;
  issues.push(...titleValidation.issues);

  // 2. MECE Structure Validation
  const meceValidation = validateMeceStructure(blueprint.supportingPoints);
  dimensions.meceStructure = meceValidation.score;
  issues.push(...meceValidation.issues);

  // 3. Pyramid Principle Validation
  const pyramidValidation = validatePyramidPrinciple(blueprint);
  dimensions.pyramidPrinciple = pyramidValidation.score;
  issues.push(...pyramidValidation.issues);

  // 4. Data Quality Validation
  const dataValidation = validateDataQuality(blueprint.dataHighlights);
  dimensions.dataQuality = dataValidation.score;
  issues.push(...dataValidation.issues);

  // 5. So-What Validation
  const soWhatValidation = validateSoWhat(blueprint.supportingPoints);
  dimensions.soWhat = soWhatValidation.score;
  issues.push(...soWhatValidation.issues);

  // 6. Visual Clarity Validation
  const visualValidation = validateVisualClarity(blueprint);
  dimensions.visualClarity = visualValidation.score;
  issues.push(...visualValidation.issues);

  // Calculate overall score
  const overall = calculateOverallScore(dimensions as QualityDimensions);

  // Determine if executive ready
  const isExecutiveReady = overall >= 3.5 && 
    Object.values(dimensions).every(score => score >= 3);

  // Generate strengths and improvements
  const strengths = generateStrengths(dimensions as QualityDimensions, issues);
  const improvements = generateImprovements(issues);

  return {
    assessment: {
      overall,
      dimensions: dimensions as QualityDimensions,
      isExecutiveReady,
      strengths,
      improvements,
    },
    issues,
  };
}

/**
 * Validates action title quality
 */
function validateActionTitle(title: string): { score: number; issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];
  let score = 3; // Start at "good"

  // Word count check
  const wordCount = title.split(/\s+/).length;
  if (wordCount < 5) {
    score = Math.min(score, 2);
    issues.push({
      severity: "warning",
      dimension: "actionTitle",
      message: "Title is too short - may lack sufficient insight",
      suggestion: "Expand to 8-14 words with more context",
    });
  } else if (wordCount > 15) {
    score = Math.min(score, 2);
    issues.push({
      severity: "warning",
      dimension: "actionTitle",
      message: "Title is too long - may be difficult to parse quickly",
      suggestion: "Condense to 8-14 words",
    });
  }

  // Check for weak words (descriptive indicators)
  const weakWords = ["analysis", "overview", "summary", "review", "update", "report"];
  const hasWeakWords = weakWords.some(word => 
    title.toLowerCase().includes(word)
  );
  
  if (hasWeakWords) {
    score = Math.min(score, 2);
    issues.push({
      severity: "error",
      dimension: "actionTitle",
      message: "Title appears descriptive rather than action-oriented",
      suggestion: `Replace weak words like "${weakWords.filter(w => title.toLowerCase().includes(w)).join(', ')}" with action verbs and insights`,
    });
  }

  // Check for action indicators
  const actionIndicators = [
    "drove", "accelerated", "increased", "decreased", "achieved", 
    "delivered", "captured", "unlocked", "enabled", "created",
    "grew", "reduced", "improved", "expanded", "transformed"
  ];
  const hasActionIndicator = actionIndicators.some(word => 
    title.toLowerCase().includes(word)
  );

  if (!hasActionIndicator) {
    score = Math.min(score, 2);
    issues.push({
      severity: "warning",
      dimension: "actionTitle",
      message: "Title may lack action orientation",
      suggestion: "Include an action verb that describes the change or result",
    });
  }

  // Check for numbers/metrics (indicates specificity)
  const hasMetrics = /\d+%?|\$[\d.]+[KMB]?/.test(title);
  if (!hasMetrics && wordCount > 5) {
    score = Math.min(score, 3);
    issues.push({
      severity: "info",
      dimension: "actionTitle",
      message: "Title could be more specific with metrics",
      suggestion: "Consider adding specific numbers (e.g., '15% growth' instead of 'significant growth')",
    });
  }

  // Check for complete sentence (has subject and verb)
  const hasVerb = actionIndicators.some(word => title.toLowerCase().includes(word));
  if (!hasVerb && !title.toLowerCase().match(/\b(is|are|was|were|has|have|had)\b/)) {
    score = Math.min(score, 2);
    issues.push({
      severity: "error",
      dimension: "actionTitle",
      message: "Title may not be a complete sentence",
      suggestion: "Ensure title has a clear subject and action",
    });
  }

  // Boost score for excellent titles
  if (!hasWeakWords && hasActionIndicator && wordCount >= 8 && wordCount <= 14 && hasMetrics) {
    score = 4;
  }

  return { score, issues };
}

/**
 * Validates MECE structure
 */
function validateMeceStructure(points?: string[]): { score: number; issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];
  
  if (!points || points.length === 0) {
    issues.push({
      severity: "error",
      dimension: "meceStructure",
      message: "No supporting points found",
      suggestion: "Add 3-4 MECE supporting points",
    });
    return { score: 1, issues };
  }

  let score = 3;

  // Check for appropriate number of points
  if (points.length < 3) {
    score = Math.min(score, 2);
    issues.push({
      severity: "warning",
      dimension: "meceStructure",
      message: `Only ${points.length} supporting points - may not be collectively exhaustive`,
      suggestion: "Add more points to ensure complete coverage",
    });
  } else if (points.length > 5) {
    score = Math.min(score, 2);
    issues.push({
      severity: "warning",
      dimension: "meceStructure",
      message: `${points.length} supporting points - may be too many for clarity`,
      suggestion: "Consolidate into 3-4 key points",
    });
  }

  // Check for potential overlaps (simplified heuristic)
  const overlapIndicators = ["and", "also", "additionally", "furthermore"];
  let overlapCount = 0;
  points.forEach((point, idx) => {
    overlapIndicators.forEach(indicator => {
      if (point.toLowerCase().includes(indicator)) {
        overlapCount++;
      }
    });
  });

  if (overlapCount > 1) {
    score = Math.min(score, 2);
    issues.push({
      severity: "warning",
      dimension: "meceStructure",
      message: "Points may have overlapping content",
      suggestion: "Ensure each point is mutually exclusive (no overlap)",
    });
  }

  // Check for parallel structure
  const firstWords = points.map(p => p.split(' ')[0].toLowerCase());
  const uniqueFirstWords = new Set(firstWords);
  if (uniqueFirstWords.size === 1 && points.length >= 3) {
    // Good parallel structure
    score = Math.max(score, 3);
  }

  return { score, issues };
}

/**
 * Validates Pyramid Principle compliance
 */
function validatePyramidPrinciple(blueprint: SlideBlueprint): { score: number; issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];
  let score = 3;

  // Check that key message supports title
  if (!blueprint.keyMessage) {
    score = 1;
    issues.push({
      severity: "error",
      dimension: "pyramidPrinciple",
      message: "No key message found",
      suggestion: "Add a clear key message that synthesizes the supporting points",
    });
    return { score, issues };
  }

  // Check that supporting points relate to key message
  if (!blueprint.supportingPoints || blueprint.supportingPoints.length === 0) {
    score = Math.min(score, 2);
    issues.push({
      severity: "error",
      dimension: "pyramidPrinciple",
      message: "Key message exists but no supporting points",
      suggestion: "Add supporting evidence for the key message",
    });
  }

  // Check for bottom-up indicators (bad)
  const bottomUpIndicators = ["based on", "from the", "according to", "analysis of"];
  const titleLower = blueprint.title.toLowerCase();
  const hasBottomUp = bottomUpIndicators.some(ind => titleLower.includes(ind));
  
  if (hasBottomUp) {
    score = Math.min(score, 2);
    issues.push({
      severity: "warning",
      dimension: "pyramidPrinciple",
      message: "Title suggests bottom-up structure",
      suggestion: "Lead with the insight, not the analysis method",
    });
  }

  return { score, issues };
}

/**
 * Validates data quality
 */
function validateDataQuality(dataHighlights?: Array<{ metric: string; context: string }>): { 
  score: number; 
  issues: ValidationIssue[] 
} {
  const issues: ValidationIssue[] = [];
  
  if (!dataHighlights || dataHighlights.length === 0) {
    issues.push({
      severity: "info",
      dimension: "dataQuality",
      message: "No data highlights provided",
      suggestion: "Consider adding key metrics to strengthen the slide",
    });
    return { score: 3, issues }; // Not an error, but could be better
  }

  let score = 3;
  let validDataCount = 0;

  dataHighlights.forEach((item, idx) => {
    // Check for metric
    if (!item.metric || item.metric.trim() === '') {
      issues.push({
        severity: "warning",
        dimension: "dataQuality",
        message: `Data highlight ${idx + 1} missing metric`,
      });
    } else {
      validDataCount++;
    }

    // Check for context (so-what)
    if (!item.context || item.context.trim() === '') {
      score = Math.min(score, 2);
      issues.push({
        severity: "error",
        dimension: "dataQuality",
        message: `Data highlight ${idx + 1} missing context - what does the number mean?`,
        suggestion: "Add context explaining why this metric matters",
      });
    }

    // Check for properly formatted numbers
    const hasProperFormat = /\d+%?|\$[\d.]+[KMB]?|million|billion/i.test(item.metric);
    if (!hasProperFormat && item.metric) {
      issues.push({
        severity: "info",
        dimension: "dataQuality",
        message: `Metric "${item.metric}" could be more clearly formatted`,
        suggestion: "Use K/M/B suffixes for large numbers and % for percentages",
      });
    }
  });

  if (validDataCount >= 2) {
    score = Math.max(score, 3);
  }

  return { score, issues };
}

/**
 * Validates so-what presence in supporting points
 */
function validateSoWhat(points?: string[]): { score: number; issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];
  
  if (!points || points.length === 0) {
    return { score: 2, issues };
  }

  let score = 3;
  let soWhatCount = 0;

  const soWhatIndicators = [
    "enabling", "allowing", "enabling", "resulting", "leading to",
    "which means", "indicating", "suggesting", "demonstrating",
    "therefore", "thus", "as a result", "consequently"
  ];

  points.forEach((point, idx) => {
    const pointLower = point.toLowerCase();
    const hasSoWhat = soWhatIndicators.some(ind => pointLower.includes(ind));
    
    // Check for metrics with explanation pattern
    const hasMetricWithExplanation = /\d+%?.*?\b(enabling|allowing|resulting|which|indicating|demonstrating|means)/i.test(point);
    
    if (!hasSoWhat && !hasMetricWithExplanation) {
      issues.push({
        severity: "warning",
        dimension: "soWhat",
        message: `Point ${idx + 1} may lack clear implication`,
        suggestion: "Add 'which means...' or 'enabling...' to explain why this matters",
      });
    } else {
      soWhatCount++;
    }
  });

  const soWhatRatio = soWhatCount / points.length;
  if (soWhatRatio === 1) {
    score = 4;
  } else if (soWhatRatio >= 0.75) {
    score = 3;
  } else if (soWhatRatio >= 0.5) {
    score = 2;
  } else {
    score = 1;
  }

  return { score, issues };
}

/**
 * Validates visual clarity
 */
function validateVisualClarity(blueprint: SlideBlueprint): { score: number; issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];
  let score = 3;

  // Check layout selection
  const validLayouts = [
    "executive-summary", "issue-tree", "2x2-matrix", 
    "waterfall", "comparison", "process-flow"
  ];
  
  if (!validLayouts.includes(blueprint.layout)) {
    score = Math.min(score, 2);
    issues.push({
      severity: "warning",
      dimension: "visualClarity",
      message: `Layout "${blueprint.layout}" is not a standard consulting layout`,
      suggestion: `Use one of: ${validLayouts.join(', ')}`,
    });
  }

  // Check for chart recommendation when data is present
  if (blueprint.dataHighlights && blueprint.dataHighlights.length >= 2) {
    if (!blueprint.visualElements?.chartType || blueprint.visualElements.chartType === 'none') {
      issues.push({
        severity: "info",
        dimension: "visualClarity",
        message: "Multiple data points present but no chart recommended",
        suggestion: "Consider adding a bar chart or line chart to visualize trends",
      });
    }
  }

  return { score, issues };
}

/**
 * Calculates overall quality score
 */
function calculateOverallScore(dimensions: QualityDimensions): number {
  const values = Object.values(dimensions);
  const sum = values.reduce((a, b) => a + b, 0);
  return Math.round((sum / values.length) * 10) / 10;
}

/**
 * Generates strengths list from positive dimensions
 */
function generateStrengths(dimensions: QualityDimensions, issues: ValidationIssue[]): string[] {
  const strengths: string[] = [];
  
  if (dimensions.actionTitle >= 3) {
    strengths.push("Action-oriented title with clear insight");
  }
  if (dimensions.meceStructure >= 3) {
    strengths.push("Well-structured supporting points");
  }
  if (dimensions.pyramidPrinciple >= 3) {
    strengths.push("Clear top-down communication flow");
  }
  if (dimensions.dataQuality >= 3) {
    strengths.push("Data-supported arguments");
  }
  if (dimensions.soWhat >= 3) {
    strengths.push("Clear implications throughout");
  }
  if (dimensions.visualClarity >= 3) {
    strengths.push("Appropriate visual structure");
  }

  return strengths.length > 0 ? strengths : ["Solid foundation with room for refinement"];
}

/**
 * Generates improvement suggestions from issues
 */
function generateImprovements(issues: ValidationIssue[]): string[] {
  const improvements = issues
    .filter(i => i.severity !== "info")
    .map(i => i.suggestion || i.message)
    .slice(0, 3); // Limit to top 3

  return improvements.length > 0 
    ? improvements 
    : ["Minor polish could elevate this to executive-ready"];
}

/**
 * Returns a human-readable quality label
 */
export function getQualityLabel(score: number): { label: string; color: string } {
  if (score >= 3.5) return { label: "Executive Ready", color: "#10B981" };
  if (score >= 3.0) return { label: "Consultant Quality", color: "#0D9488" };
  if (score >= 2.0) return { label: "Good - Needs Refinement", color: "#F59E0B" };
  return { label: "Needs Significant Work", color: "#EF4444" };
}

/**
 * Returns actionable feedback for users
 */
export function getUserFeedback(assessment: QualityAssessment): string {
  if (assessment.isExecutiveReady) {
    return "🌟 Excellent work! This slide meets top-tier consulting standards and is ready for executive presentation.";
  }

  if (assessment.overall >= 3.0) {
    return `✅ Strong foundation! A few refinements will make this executive-ready: ${assessment.improvements[0]}`;
  }

  if (assessment.overall >= 2.0) {
    return `⚠️ Good start, but needs work. Focus on: ${assessment.improvements.slice(0, 2).join("; ")}`;
  }

  return `❌ This slide needs significant revision. Priority fixes: ${assessment.improvements.slice(0, 2).join("; ")}`;
}
