"use client";

import { useState } from "react";
import { Header } from "../../components/header";
import { SlideForm } from "../../components/slide-form";
import { SlidePreview } from "../../components/slide-preview";
import { QualityScore } from "../../components/quality-score";
import { AuthModal } from "../../components/auth-modal";
import { generateSlide } from "../../lib/api";
import { GenerateSlideRequest, SlideData } from "../../lib/types";
import { validateSlideQuality } from "../../lib/quality-validation";
import { useToast } from "../../hooks/use-toast";

export default function AppPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentSlide, setCurrentSlide] = useState<SlideData | null>(null);
  const [lastRequest, setLastRequest] = useState<GenerateSlideRequest | null>(null);
  const { toast } = useToast();

  const handleGenerate = async (request: GenerateSlideRequest) => {
    setIsGenerating(true);
    setLastRequest(request);

    try {
      const response = await generateSlide(request);

      if (response.success && response.slide) {
        // Run quality validation on the generated slide
        const qualityResult = validateSlideQuality(response.slide.blueprint || {
          title: response.slide.title,
          layout: response.slide.layout,
          keyMessage: '',
          supportingPoints: []
        });
        
        // Attach quality assessment to slide
        const slideWithQuality = {
          ...response.slide,
          qualityAssessment: qualityResult.assessment
        };
        
        setCurrentSlide(slideWithQuality);
        
        // Show quality-based toast
        if (qualityResult.assessment.isExecutiveReady) {
          toast({
            title: "🌟 Executive-ready slide generated",
            description: `Quality score: ${qualityResult.assessment.overall.toFixed(1)}/4.0 - Meets top-tier consulting standards`,
          });
        } else if (qualityResult.assessment.overall >= 3.0) {
          toast({
            title: "✨ Consultant-quality slide generated",
            description: `Quality score: ${qualityResult.assessment.overall.toFixed(1)}/4.0 - Minor refinements suggested`,
          });
        } else {
          toast({
            title: "✅ Slide generated",
            description: `Quality score: ${qualityResult.assessment.overall.toFixed(1)}/4.0 - Review improvement suggestions`,
          });
        }
      } else {
        toast({
          title: "Generation failed",
          description: response.error || "We couldn't generate your slide. Please try again.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Something went wrong",
        description: "An unexpected error occurred. Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    if (lastRequest) {
      handleGenerate(lastRequest);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header onLoginClick={() => setIsAuthModalOpen(true)} />

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Input Panel - Enhanced */}
        <div className="w-full lg:w-[400px] xl:w-[450px] h-[50vh] lg:h-[calc(100vh-65px)] overflow-y-auto border-r border-slate-200 bg-white">
          <SlideForm onSubmit={handleGenerate} isLoading={isGenerating} />
        </div>

        {/* Preview Panel - Enhanced with Quality Score */}
        <div className="flex-1 flex flex-col lg:flex-row h-[50vh] lg:h-[calc(100vh-65px)] overflow-hidden bg-slate-100/50">
          {/* Slide Preview */}
          <div className="flex-1 overflow-hidden">
            <SlidePreview
              slide={currentSlide}
              isLoading={isGenerating}
              onRegenerate={handleRegenerate}
            />
          </div>
          
          {/* Quality Score Panel */}
          <div className="w-full lg:w-[300px] xl:w-[320px] border-l border-slate-200 bg-white overflow-y-auto">
            <QualityScore 
              assessment={currentSlide?.qualityAssessment || null}
              className="border-0 shadow-none"
            />
          </div>
        </div>
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
