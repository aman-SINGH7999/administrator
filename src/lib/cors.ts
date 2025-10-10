//src/lib/cors.ts


import { NextResponse } from "next/server";

// Allowed origins
export const ALLOWED_ORIGINS = [
  "http://localhost:3000", 
  "http://localhost:3001"
];

// Get CORS headers dynamically
export function getCorsHeaders(origin: string) {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };

  if (ALLOWED_ORIGINS.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

// Handle OPTIONS preflight
export function handlePreflight(req: Request) {
  const origin = req.headers.get("origin") || "";
  const headers = getCorsHeaders(origin);
  return new NextResponse(null, {
    status: ALLOWED_ORIGINS.includes(origin) ? 200 : 403,
    headers,
  });
}
