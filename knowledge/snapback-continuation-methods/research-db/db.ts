// Typed index for the snapback-continuation-methods corpus (minted 2026-10-02).
export interface DigResult { title: string; url: string; engine: string; jev_weight: number | null; task_ids: string[]; timestamp: string; }
export interface DigRecord { doc: string; queries: string[]; results: DigResult[]; dig_fallback?: string; }
export const corpus = "snapback-continuation-methods";
export const minted = "2026-10-02";
export const companion = "knowledge/linear-viscoelasticity/00-ideate-and-missing-links.md";
