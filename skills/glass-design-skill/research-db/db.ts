export interface PreflightRecord {
  checked_at: string;
  searxng: { url: string; status: number; result_count: number; ok: boolean };
  decide: { url: string; status: number; model: string; smoke_weight: number; ok: boolean };
}
export interface SubtopicSpec {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
}
export interface ArchiveEntry {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number;
  decision: {
    type: "noul";
    instructions: string;
    model: string;
    answer: { type: "noul"; noul: number };
    usage: { input_tokens: number; output_tokens: number };
    requested_at: string;
  };
  redo_of: string | null;
}
export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: Array<{ query: string; attempt: number; raw_results: number; kept: number }>;
  redo_count: number;
  redo_log: unknown[];
  results_kept: number;
  outcome: "authored" | "skipped";
  skip_reason?: string;
}
