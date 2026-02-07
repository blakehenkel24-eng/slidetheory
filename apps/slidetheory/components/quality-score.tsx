"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  ChevronDown, 
  ChevronUp,
  Award,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { QualityAssessment, QualityDimensions } from "../lib/quality-validation";
import { cn } from "../lib/utils";

interface QualityScoreProps {
  assessment: QualityAssessment | null;
  className?: string;
}

export function QualityScore({ assessment, className }: QualityScoreProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!assessment) {
    return (
      <Card className={cn("border-dashed border-slate-200", className)}>
        <CardContent className="py-6 text-center">
          <Info className="h-8 w-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-400">
            Generate a slide to see quality assessment
          </p>
        </CardContent>
      </Card>
    );
  }

  const { overall, dimensions, isExecutiveReady, strengths, improvements } = assessment;
  const percentage = (overall / 4) * 100;

  const getScoreColor = (score: number) => {
    if (score >= 3.5) return "text-emerald-600";
    if (score >= 3.0) return "text-teal-600";
    if (score >= 2.0) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 3.5) return "bg-emerald-100";
    if (score >= 3.0) return "bg-teal-100";
    if (score >= 2.0) return "bg-amber-100";
    return "bg-red-100";
  };

  const getProgressColor = (score: number) => {
    if (score >= 3.5) return "bg-emerald-500";
    if (score >= 3.0) return "bg-teal-500";
    if (score >= 2.0) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Award className="h-4 w-4 text-teal-600" />
            Quality Score
          </CardTitle>
          {isExecutiveReady ? (
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Executive Ready
            </Badge>
          ) : overall >= 3.0 ? (
            <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-100">
              <TrendingUp className="h-3 w-3 mr-1" />
              Consultant Quality
            </Badge>
          ) : (
            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Needs Refinement
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Overall Score */}
        <div className="text-center pb-4 border-b border-slate-100">
          <div className={cn("text-4xl font-bold", getScoreColor(overall))}>
            {overall.toFixed(1)}
            <span className="text-lg text-slate-400 font-normal">/4.0</span>
          </div>
          <Progress 
            value={percentage} 
            className="mt-3 h-2"
          />
          <p className="text-xs text-slate-500 mt-2">
            {isExecutiveReady 
              ? "🌟 Meets top-tier consulting standards"
              : overall >= 3.0 
                ? "✅ Strong foundation with minor refinement needed"
                : "⚠️ Review improvement suggestions below"
            }
          </p>
        </div>

        {/* Dimension Breakdown */}
        <div className="space-y-2">
          <DimensionRow 
            label="Action Title" 
            score={dimensions.actionTitle}
            description="Insightful, not descriptive"
          />
          <DimensionRow 
            label="MECE Structure" 
            score={dimensions.meceStructure}
            description="Mutually exclusive, collectively exhaustive"
          />
          <DimensionRow 
            label="Pyramid Principle" 
            score={dimensions.pyramidPrinciple}
            description="Top-down communication"
          />
          <DimensionRow 
            label="Data Quality" 
            score={dimensions.dataQuality}
            description="Supported and formatted"
          />
          <DimensionRow 
            label="So-What?" 
            score={dimensions.soWhat}
            description="Clear implications throughout"
          />
          <DimensionRow 
            label="Visual Clarity" 
            score={dimensions.visualClarity}
            description="Clean, professional design"
          />
        </div>

        {/* Expandable Details */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          <span>{isExpanded ? "Hide details" : "View details"}</span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {isExpanded && (
          <div className="space-y-4 pt-2 border-t border-slate-100">
            {/* Strengths */}
            {strengths.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                  Strengths
                </h4>
                <ul className="space-y-1">
                  {strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improvements */}
            {improvements.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                  Suggested Improvements
                </h4>
                <ul className="space-y-1">
                  {improvements.map((improvement, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                      <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface DimensionRowProps {
  label: string;
  score: number;
  description: string;
}

function DimensionRow({ label, score, description }: DimensionRowProps) {
  const getScoreColor = (s: number) => {
    if (s >= 3.5) return "text-emerald-600 bg-emerald-50";
    if (s >= 3.0) return "text-teal-600 bg-teal-50";
    if (s >= 2.0) return "text-amber-600 bg-amber-50";
    return "text-red-600 bg-red-50";
  };

  const getScoreLabel = (s: number) => {
    if (s >= 3.5) return "Excellent";
    if (s >= 3.0) return "Good";
    if (s >= 2.0) return "Fair";
    return "Poor";
  };

  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700">{label}</span>
          <span className="text-xs text-slate-400 truncate">{description}</span>
        </div>
      </div>
      <Badge 
        variant="secondary" 
        className={cn("text-xs font-medium", getScoreColor(score))}
      >
        {score.toFixed(1)}
      </Badge>
    </div>
  );
}

/**
 * Compact quality indicator for slide preview
 */
export function QualityIndicator({ 
  score, 
  isExecutiveReady 
}: { 
  score: number; 
  isExecutiveReady: boolean;
}) {
  if (isExecutiveReady) {
    return (
      <div className="flex items-center gap-1.5 text-emerald-600">
        <Award className="h-4 w-4" />
        <span className="text-sm font-medium">Executive Ready</span>
      </div>
    );
  }

  if (score >= 3.0) {
    return (
      <div className="flex items-center gap-1.5 text-teal-600">
        <TrendingUp className="h-4 w-4" />
        <span className="text-sm font-medium">{score.toFixed(1)}/4.0</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-amber-600">
      <AlertTriangle className="h-4 w-4" />
      <span className="text-sm font-medium">{score.toFixed(1)}/4.0</span>
    </div>
  );
}
