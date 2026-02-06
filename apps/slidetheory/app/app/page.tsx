"use client";

import { useState } from "react";
import { Header } from "../../components/header";
import { SlideForm } from "../../components/slide-form";
import { SlidePreview } from "../../components/slide-preview";
import { AuthModal } from "../../components/auth-modal";
import { generateSlide } from "../../lib/api";
import { GenerateSlideRequest, SlideData } from "../../lib/types";
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
        setCurrentSlide(response.slide);
        toast({
          title: "✨ Slide generated successfully",
          description: "Your consultant-quality slide is ready.",
        });
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
        {/* Input Panel - 35% */}
        <div className="w-full lg:w-[35%] h-[50vh] lg:h-[calc(100vh-57px)] overflow-y-auto border-r border-slate-200 bg-white">
          <SlideForm onSubmit={handleGenerate} isLoading={isGenerating} />
        </div>

        {/* Preview Panel - 65% */}
        <div className="w-full lg:w-[65%] h-[50vh] lg:h-[calc(100vh-57px)] overflow-hidden bg-slate-100/50">
          <SlidePreview
            slide={currentSlide}
            isLoading={isGenerating}
            onRegenerate={handleRegenerate}
          />
        </div>
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
