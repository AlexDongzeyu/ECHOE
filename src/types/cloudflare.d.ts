/// <reference types="@cloudflare/workers-types" />

// Re-export Cloudflare types for easier importing
export type D1Database = globalThis.D1Database;
export type D1Result<T = unknown> = globalThis.D1Result<T>;
export type D1PreparedStatement = globalThis.D1PreparedStatement; 