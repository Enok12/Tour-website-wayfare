import { NextResponse } from "next/server";

// Every API response follows the same envelope so mobile clients (Android /
// iOS, per the future-scalability requirement) can rely on one shape:
//   { success: true,  data: T,        meta?: {...} }
//   { success: false, error: { code, message, details? } }

export interface ApiMeta {
  page?: number;
  pageSize?: number;
  total?: number;
  totalPages?: number;
  [key: string]: unknown;
}

export function apiSuccess<T>(data: T, meta?: ApiMeta, init?: number) {
  return NextResponse.json(
    { success: true, data, ...(meta ? { meta } : {}) },
    { status: init ?? 200 }
  );
}

export function apiError(
  message: string,
  statusCode = 500,
  code = "INTERNAL_SERVER_ERROR",
  details?: unknown
) {
  return NextResponse.json(
    {
      success: false,
      error: { code, message, ...(details ? { details } : {}) },
    },
    { status: statusCode }
  );
}
