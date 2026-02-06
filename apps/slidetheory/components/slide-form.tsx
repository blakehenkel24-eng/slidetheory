"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Loader2, Sparkles, Paperclip, ChevronDown, ChevronUp, Info } from "lucide-react";
import {
  SlideType,
  Audience,
  SLIDE_TYPES,
  AUDIENCES,
} from "../lib/types";
import type { GenerateSlideRequest, PresentationMode } from "../lib/types";

interface SlideFormProps {
  onSubmit: (data: GenerateSlideRequest) => void;
  isLoading: boolean;
}

export function SlideForm({ onSubmit, isLoading }: SlideFormProps) {
  const [slideType, setSlideType] = useState<SlideType>("auto");
  const [audience, setAudience] = useState<Audience>("auto");
  const [context, setContext] = useState("");
  const [keyTakeaway, setKeyTakeaway] = useState("");
  const [dataInput, setDataInput] = useState("");
  const [presentationMode, setPresentationMode] = useState<PresentationMode>("presentation");
  const [fileName, setFileName] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setDataInput(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      slideType,
      audience,
      context,
      keyTakeaway,
      presentationMode,
      dataInput: dataInput || undefined,
    });
  };

  const isFormValid =
    context.length >= 10 && keyTakeaway.length >= 5;

  return (
    <Card className="h-full border-0 shadow-none bg-white lg:rounded-none">
      <CardHeader className="pb-4 px-5 pt-5 lg:px-6 lg:pt-6">
        <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span>Generate Slide</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-6 lg:px-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Context Dump - Primary Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="context" className="text-sm font-semibold text-slate-900">
                Context Dump
              </Label>
              <span className={`text-xs character-count ${
                context.length > 1800 ? 'text-amber-600' : 'text-slate-400'
              }`}>
                {context.length}/2000
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Paste everything you know — research, notes, data, background. The AI will structure it.
            </p>
            <Textarea
              id="context"
              placeholder="Dump everything here: research findings, meeting notes, data points, client background, market info, competitive analysis..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="min-h-[140px] bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 resize-none focus:border-blue-500 focus:ring-blue-500/20 transition-all"
              minLength={10}
              maxLength={2000}
              required
            />
          </div>

          <Separator className="bg-slate-100" />

          {/* What's the Message - Key Takeaway */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="keyTakeaway" className="text-sm font-semibold text-slate-900">
                What&apos;s the Message?
              </Label>
              <span className={`text-xs character-count ${
                keyTakeaway.length > 120 ? 'text-amber-600' : 'text-slate-400'
              }`}>
                {keyTakeaway.length}/150
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              The single most important thing your audience should remember.
            </p>
            <Textarea
              id="keyTakeaway"
              placeholder="e.g., 'We need to enter the European market by Q3 to capture first-mover advantage'"
              value={keyTakeaway}
              onChange={(e) => setKeyTakeaway(e.target.value)}
              className="min-h-[80px] bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 resize-none focus:border-blue-500 focus:ring-blue-500/20 transition-all"
              minLength={5}
              maxLength={150}
              required
            />
          </div>

          <Separator className="bg-slate-100" />

          {/* Advanced Options Toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors group"
          >
            <span className="flex items-center gap-2">
              Advanced Options
              <Info className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-500" />
            </span>
            <div className={`p-1 rounded-md transition-colors ${showAdvanced ? 'bg-slate-100' : ''}`}>
              {showAdvanced ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </button>

          {/* Advanced Options Panel */}
          <div className={`space-y-5 overflow-hidden transition-all duration-300 ${
            showAdvanced ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
          }`}>
            
            {/* Slide Type */}
            <div className="space-y-2">
              <Label htmlFor="slideType" className="text-sm font-medium text-slate-700">
                Slide Type
              </Label>
              <Select value={slideType} onValueChange={(v) => setSlideType(v as SlideType)}>
                <SelectTrigger className="bg-white border-slate-200 text-slate-900 focus:ring-blue-500/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  {SLIDE_TYPES.map((type) => (
                    <SelectItem
                      key={type.value}
                      value={type.value}
                      className="text-slate-900 focus:bg-slate-50 cursor-pointer"
                    >
                      <div className="flex flex-col py-0.5">
                        <span className="font-medium">{type.label}</span>
                        <span className="text-xs text-slate-500">{type.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Audience */}
            <div className="space-y-2">
              <Label htmlFor="audience" className="text-sm font-medium text-slate-700">
                Target Audience
              </Label>
              <Select value={audience} onValueChange={(v) => setAudience(v as Audience)}>
                <SelectTrigger className="bg-white border-slate-200 text-slate-900 focus:ring-blue-500/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  {AUDIENCES.map((aud) => (
                    <SelectItem
                      key={aud.value}
                      value={aud.value}
                      className="text-slate-900 focus:bg-slate-50 cursor-pointer"
                    >
                      <div className="flex flex-col py-0.5">
                        <span className="font-medium">{aud.label}</span>
                        <span className="text-xs text-slate-500">{aud.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Presentation Mode Toggle */}
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 border border-slate-100">
              <div className="space-y-1">
                <Label htmlFor="presentation-mode" className="text-sm font-semibold text-slate-900">
                  {presentationMode === "presentation" ? "Presentation Mode" : "Read Mode"}
                </Label>
                <p className="text-xs text-slate-500">
                  {presentationMode === "presentation"
                    ? "Minimal text, bullet points for live presenting"
                    : "Detailed content with full sentences for reading"}
                </p>
              </div>
              <Switch
                id="presentation-mode"
                checked={presentationMode === "read"}
                onCheckedChange={(checked) =>
                  setPresentationMode(checked ? "read" : "presentation")
                }
              />
            </div>

            {/* Data Input */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Data & Metrics (Optional)</Label>
              <Textarea
                placeholder="Paste data, metrics, or CSV content here..."
                value={dataInput}
                onChange={(e) => setDataInput(e.target.value)}
                className="min-h-[80px] bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 resize-none font-mono text-sm focus:border-blue-500 focus:ring-blue-500/20"
              />
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept=".csv,.txt,.json,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                  id="data-file"
                />
                <Label
                  htmlFor="data-file"
                  className="cursor-pointer inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium"
                >
                  <Paperclip className="h-4 w-4" />
                  {fileName || "Attach file (.csv, .txt, .json, .xlsx)"}
                </Label>
                {fileName && (
                  <button
                    type="button"
                    onClick={() => { setFileName(null); setDataInput(''); }}
                    className="text-xs text-slate-400 hover:text-red-500 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          <Separator className="bg-slate-100" />

          {/* Generate Button */}
          <div className="space-y-3">
            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white h-11 font-semibold shadow-sm shadow-blue-500/20 disabled:shadow-none disabled:opacity-50 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating slide...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Slide
                </>
              )}
            </Button>

            {!isFormValid && (
              <p className="text-xs text-slate-400 text-center">
                Add context (10+ chars) and a message (5+ chars) to generate
              </p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
