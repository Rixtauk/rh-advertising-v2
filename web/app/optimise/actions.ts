"use server";

// Server actions run on Vercel's servers, not in the browser
// They need the full Railway URL for server-to-server communication (no CORS issues)
// API_URL is server-side only (not NEXT_PUBLIC_*)
const API_BASE_URL = process.env.API_URL || "https://rh-advertising-v2-production.up.railway.app";

interface OptimiseRequest {
  url: string;
  objective: string;
}

export async function optimiseLandingPage(data: OptimiseRequest) {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/optimize-landing`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to optimise landing page");
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error("Error optimising landing page:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
