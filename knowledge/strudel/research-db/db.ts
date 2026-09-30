// Typed research-DB index for the strudel corpus (minted 2026-09-30).
// Full result archive lives in archive.json; per-doc dig payloads in digs/.
export interface JevResult {
  slug: string; qk: string; ri: number;
  title: string | null; url: string | null; snippet: string;
  jev: number | null;
}
export interface DigQuery { query: string; results: unknown[] }
export interface Preflight {
  searxng: { http: number; results: number };
  jev: { http: number; probe_noul: number; cost: number; task_id: string };
}
export const CORPUS = "strudel" as const;
export const PREFLIGHT: Preflight = { searxng: { http: 200, results: 125 }, jev: { http: 200, probe_noul: 0.41, cost: 0.000028224, task_id: "ta970782-b0ab-4c79-8c0f-b70a8f72dde3" } };
export const DOC_ORDER = ["01-overview-ecosystem", "02-repl-mechanics", "03-mini-notation", "04-sounds-banks-samples", "05-notes-scales-tempo", "06-audio-effects", "07-signals-modulation", "08-pattern-effects", "09-hardware-integrations", "10-livecoding-practice"] as const;
export const STATS = { totalResults: 120, keptJe05: 89, jevCalls: 24, jevCost: 0.0024590159999999996, digQueries: 20 } as const;
