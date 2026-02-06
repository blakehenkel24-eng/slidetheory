import { GenerateSlideRequest, GenerateSlideResponse, SlideBlueprint } from "./types";

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
    // Step 1: Generate blueprint and HTML content
    const result = await supabaseFetch("generate-slide", {
      context: request.context,
      keyTakeaway: request.keyTakeaway,
      slideType: request.slideType,
      audience: request.audience,
      data: request.data,
      presentationMode: request.presentationMode,
    });

    if (!result.success) {
      throw new Error(result.error);
    }

    // NOTE: AI image generation disabled - causes text hallucinations
    // HTML rendering provides crisp, accurate text
    // Image generation can be added back later for decorative elements only

    return {
      success: true,
      slide: {
        id: result.slide.id,
        title: result.slide.title,
        content: result.slide.content,
        layout: result.slide.layout,
        blueprint: result.blueprint,
        generatedAt: result.generatedAt,
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

export async function generateImageFromBlueprint(blueprint: SlideBlueprint, style = 'corporate') {
  try {
    return await supabaseFetch("generate-slide-image", { blueprint, style });
  } catch (error) {
    console.error("Failed to generate image:", error);
    throw error;
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
