"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, File, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "processing" | "complete" | "error";
  error?: string;
}

export function SlideUpload() {
  const [files, setFiles] = useState<UploadingFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    const validFiles = selectedFiles.filter(file => {
      const isValid = file.name.endsWith('.pptx') || file.name.endsWith('.pdf') || file.name.endsWith('.ppt');
      if (!isValid) {
        toast({
          title: "Invalid file",
          description: `${file.name} is not a supported format (PPTX, PPT, PDF)`,
          variant: "destructive",
        });
      }
      return isValid;
    });

    const newFiles: UploadingFile[] = validFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      progress: 0,
      status: "pending",
    }));

    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    
    for (const fileObj of files.filter(f => f.status === "pending")) {
      setFiles(prev => prev.map(f => 
        f.id === fileObj.id ? { ...f, status: "uploading" } : f
      ));

      try {
        const base64 = await fileToBase64(fileObj.file);
        
        const response = await fetch('/api/slides/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: fileObj.file.name,
            content: base64,
            metadata: {
              source: 'reference_deck',
              uploaded_by: 'developer',
            }
          }),
        });

        if (!response.ok) throw new Error('Upload failed');

        setFiles(prev => prev.map(f => 
          f.id === fileObj.id ? { ...f, status: "complete", progress: 100 } : f
        ));

        toast({
          title: "Upload complete",
          description: `${fileObj.file.name} has been added to your slide library.`,
        });

      } catch {
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id ? { ...f, status: "error", error: "Upload failed" } : f
        ));

        toast({
          title: "Upload failed",
          description: `Failed to upload ${fileObj.file.name}`,
          variant: "destructive",
        });
      }
    }

    setIsUploading(false);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <Card className="border-slate-200 bg-white shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Upload className="h-5 w-5 text-blue-500" />
          Upload Reference Decks
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-slate-600">
          Upload your slide decks (PPTX, PPT, PDF) to build your style library. 
          The AI will use these as inspiration for new slides.
        </div>

        {/* Drop Zone */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm text-slate-600">
            Click to select files or drag and drop
          </p>
          <p className="text-xs text-slate-400 mt-1">
            PPTX, PPT, PDF up to 50MB each
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pptx,.ppt,.pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-slate-700">
              {files.length} file{files.length !== 1 ? 's' : ''} selected
            </div>
            
            <div className="max-h-48 overflow-y-auto space-y-2">
              {files.map((fileObj) => (
                <div 
                  key={fileObj.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <File className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 truncate max-w-[200px]">
                        {fileObj.file.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {fileObj.status === "uploading" && (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                    )}
                    {fileObj.status === "complete" && (
                      <span className="text-xs text-green-600">✓ Done</span>
                    )}
                    {fileObj.status === "error" && (
                      <span className="text-xs text-red-600">✗ Failed</span>
                    )}
                    <button
                      onClick={() => removeFile(fileObj.id)}
                      disabled={isUploading}
                      className="p-1 hover:bg-slate-200 rounded"
                    >
                      <X className="h-4 w-4 text-slate-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Button */}
        {files.some(f => f.status === "pending") && (
          <Button
            onClick={uploadFiles}
            disabled={isUploading || !files.some(f => f.status === "pending")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload {files.filter(f => f.status === "pending").length} Deck{files.filter(f => f.status === "pending").length !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
