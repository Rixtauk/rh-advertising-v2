"use server";

// Use relative /api path that gets proxied to Railway via Vercel rewrites
// In dev: next.config.mjs proxies to http://localhost:8000
// In prod: vercel.json proxies to Railway
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

interface OptimizeRequest {
  url: string;
  objective: string;
}

export async function optimizeLandingPage(data: OptimizeRequest) {
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
      throw new Error(error.detail || "Failed to optimize landing page");
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error("Error optimizing landing page:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
