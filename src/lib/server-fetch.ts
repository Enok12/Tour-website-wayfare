import { headers } from "next/headers";
import type { ApiResponse } from "@/lib/api-client";

/**
 * Server Components still call the REST API rather than importing services
 * directly, per the required Frontend -> REST API -> Business Logic layering.
 * This resolves an absolute URL for `fetch` (which, unlike the browser,
 * needs one on the server) from the incoming request headers, falling back
 * to NEXT_PUBLIC_APP_URL / VERCEL_URL for edge cases like static generation.
 */
export async function serverFetch<T>(
  path: string,
  init?: RequestInit
): Promise<ApiResponse<T>> {
  let origin = process.env.NEXT_PUBLIC_APP_URL;

  try {
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = headersList.get("x-forwarded-proto") ?? "http";
    if (host) origin = `${protocol}://${host}`;
  } catch {
    // headers() throws outside a request context (e.g. during `next build`
    // static analysis) -- fall back to the configured app URL below.
  }

  if (!origin && process.env.VERCEL_URL) {
    origin = `https://${process.env.VERCEL_URL}`;
  }

  const res = await fetch(`${origin ?? "http://localhost:3000"}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });

  return (await res.json()) as ApiResponse<T>;
}
