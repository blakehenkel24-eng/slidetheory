import { GenerateSlideRequest, GenerateSlideResponse } from "./types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

async function supabaseFetch(functionName: string, body?: any) {
  const url = `${SUPABASE_URL}/functions/v1/${functionName}`;
  
  const response = await fetch(url, {
    method: body ? "POST" : "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    },
    ...(body && { body: JSON.stringify(body) }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function generateSlide(request: GenerateSlideRequest): Promise<GenerateSlideResponse> {
  try {
    const result = await supabaseFetch("generate-slide", {
      prompt: `Create a ${request.slideType} slide for ${request.audience} audience. Key takeaway: ${request.keyTakeaway}. Context: ${request.context}`,
      slideType: request.slideType,
      audience: request.audience,
    });

    return {
      success: true,
      slide: {
        id: result.jobId,
        content: result.content,
        type: request.slideType,
      },
    };
  } catch (error) {
    console.error("Failed to generate slide:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function getTemplates() {
  try {
    return await supabaseFetch("get-templates");
  } catch (error) {
    console.error("Failed to get templates:", error);
    return { templates: [] };
  }
}

export async function searchSlides(query: string) {
  try {
    return await supabaseFetch("search-slides", { query });
  } catch (error) {
    console.error("Failed to search slides:", error);
    return { slides: [] };
  }
}

export async function exportSlide(slideId: string, format: "png" | "pdf") {
  try {
    return await supabaseFetch("export-slide", { slideId, format });
  } catch (error) {
    console.error("Failed to export slide:", error);
    throw error;
  }
}
