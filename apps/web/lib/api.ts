import { GenerateSlideRequest, GenerateSlideResponse } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export async function generateSlide(request: GenerateSlideRequest): Promise<GenerateSlideResponse> {
  try {
    const response = await fetch(`${API_BASE}/api/generate-slide-v2`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to generate slide:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function exportSlide(slideId: string, format: "png" | "pdf"): Promise<Blob> {
  const response = await fetch(`${API_BASE}/api/export/${slideId}?format=${format}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Failed to export slide: ${response.status}`);
  }

  return await response.blob();
}
