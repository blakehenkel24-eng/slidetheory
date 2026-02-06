"use client";

import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Download,
  RotateCcw,
  FileImage,
  FileText,
  FileType,
  Eye,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Presentation,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { SlideData } from "../lib/types";

interface SlidePreviewProps {
  slide: SlideData | null;
  isLoading: boolean;
  onRegenerate: () => void;
}

export function SlidePreview({ slide, isLoading, onRegenerate }: SlidePreviewProps) {
  const [zoom, setZoom] = useState(1);
  const slideRef = useRef<HTMLDivElement>(null);

  const handleExportPNG = async () => {
    if (!slideRef.current || !slide) return;

    try {
      const canvas = await html2canvas(slideRef.current, {
        scale: 2,
        backgroundColor: null,
      });
      
      const link = document.createElement("a");
      link.download = `slidetheory-${slide.id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Failed to export PNG:", error);
    }
  };

  const handleExportPDF = async () => {
    if (!slideRef.current || !slide) return;

    try {
      const canvas = await html2canvas(slideRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`slidetheory-${slide.id}.pdf`);
    } catch (error) {
      console.error("Failed to export PDF:", error);
    }
  };

  const handleExportPPTX = () => {
    alert("PPTX export coming soon! Use PNG or PDF for now.");
  };

  // Empty State
  if (!slide && !isLoading) {
    return (
      <Card className="h-full border-0 shadow-none bg-transparent flex flex-col">
        {/* Toolbar - Disabled State */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200/60 bg-white/50">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled
              className="border-slate-200 text-slate-400"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-slate-400 min-w-[60px] text-center">100%</span>
            <Button
              variant="outline"
              size="sm"
              disabled
              className="border-slate-200 text-slate-400"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled
              className="border-slate-200 text-slate-400"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Regenerate
            </Button>
            <Button
              size="sm"
              disabled
              className="bg-slate-200 text-slate-400"
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>

        {/* Empty State Content */}
        <CardContent className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-sm animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-inner">
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                <Presentation className="h-6 w-6 text-slate-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Ready to generate
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              Fill out the form on the left and click <strong className="text-slate-700">Generate Slide</strong> to create your consultant-quality slide.
            </p>
            <div className="flex flex-col gap-2 text-xs text-slate-400">
              <div className="flex items-center justify-center gap-4">
                <span className="flex items-center gap-1"><Sparkles className="h-3 w-3" /> AI-powered</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span>MBB-quality output</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span>Export ready</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Loading State
  if (isLoading) {
    return (
      <Card className="h-full border-0 shadow-none bg-transparent flex flex-col">
        {/* Toolbar - Disabled State */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200/60 bg-white/50">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled className="border-slate-200 text-slate-400">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-slate-400 min-w-[60px] text-center">100%</span>
            <Button variant="outline" size="sm" disabled className="border-slate-200 text-slate-400">
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled className="border-slate-200 text-slate-400">
              <RotateCcw className="h-4 w-4 mr-1" />
              Regenerate
            </Button>
            <Button size="sm" disabled className="bg-slate-200 text-slate-400">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>

        {/* Loading Content */}
        <CardContent className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-sm">
            <div className="relative w-20 h-20 mx-auto mb-6">
              {/* Animated rings */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 animate-pulse"></div>
              <div className="absolute inset-2 rounded-xl bg-white shadow-sm flex items-center justify-center">
                <div className="w-6 h-6 border-3 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Generating your slide
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Our AI is analyzing your context and crafting a consultant-quality slide. This takes about 30 seconds.
            </p>
            
            {/* Loading progress bars */}
            <div className="mt-6 space-y-2">
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full animate-shimmer w-3/4"></div>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Analyzing context...</span>
                <span className="character-count">~25s</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Slide Preview State
  return (
    <Card className="h-full border-0 shadow-none bg-transparent flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
            className="border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 h-8 w-8 p-0"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-slate-600 min-w-[56px] text-center character-count">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom((z) => Math.min(1.5, z + 0.1))}
            className="border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 h-8 w-8 p-0"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRegenerate}
            className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900"
          >
            <RotateCcw className="h-4 w-4 mr-1.5" />
            Regenerate
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-sm shadow-blue-500/20"
              >
                <Download className="h-4 w-4 mr-1.5" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border-slate-200 shadow-lg">
              <DropdownMenuItem
                onClick={handleExportPNG}
                className="text-slate-700 focus:bg-slate-50 focus:text-slate-900 cursor-pointer"
              >
                <FileImage className="h-4 w-4 mr-2 text-blue-500" />
                Export as PNG
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleExportPDF}
                className="text-slate-700 focus:bg-slate-50 focus:text-slate-900 cursor-pointer"
              >
                <FileText className="h-4 w-4 mr-2 text-red-500" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleExportPPTX}
                className="text-slate-700 focus:bg-slate-50 focus:text-slate-900 cursor-pointer"
              >
                <FileType className="h-4 w-4 mr-2 text-orange-500" />
                Export as PPTX
                <span className="ml-auto text-xs text-slate-400">Soon</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Slide Preview */}
      <CardContent className="flex-1 overflow-auto p-6 flex items-center justify-center bg-slate-100/30">
        <div
          style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
          className="transition-transform duration-200 ease-out"
        >
          <div
            ref={slideRef}
            className="slide-preview-container w-[800px] bg-white rounded-lg shadow-xl overflow-hidden border border-slate-200/60"
            style={{ aspectRatio: "16/9" }}
          >
            {slide?.imageUrl ? (
              <img
                src={slide.imageUrl}
                alt="Generated slide"
                className="w-full h-full object-contain"
              />
            ) : slide?.htmlContent ? (
              <div
                className="w-full h-full"
                dangerouslySetInnerHTML={{ __html: slide.htmlContent }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-12 text-slate-800">
                {/* Default Slide Template */}
                <div className="w-full border-b-2 border-slate-800 pb-4 mb-6">
                  <h1 className="text-3xl font-bold text-slate-900">{slide?.slideType}</h1>
                </div>
                <div className="w-full flex-1 space-y-4">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <p className="font-semibold text-slate-700 mb-2">Key Takeaway:</p>
                    <p className="text-lg text-slate-900">{slide?.keyTakeaway}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <p className="text-sm font-medium text-slate-500 mb-1">Target Audience</p>
                      <p className="text-slate-900">{slide?.audience}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <p className="text-sm font-medium text-slate-500 mb-1">Presentation Mode</p>
                      <p className="text-slate-900 capitalize">{slide?.presentationMode}</p>
                    </div>
                  </div>
                  {slide?.dataInput && (
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <p className="text-sm font-medium text-slate-500 mb-1">Data &amp; Metrics</p>
                      <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono">{slide.dataInput}</pre>
                    </div>
                  )}
                </div>
                <div className="w-full mt-6 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400 text-center">
                    Generated by SlideTheory • {new Date(slide?.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
