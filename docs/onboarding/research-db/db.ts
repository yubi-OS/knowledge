// research-db file -> interface map for the docs/onboarding corpus mint (2026-10-06)
// preflight.json   -> PreflightRecord
// outline.json     -> OutlineRecord
// archive.json     -> DugResult[] (one entry per collected search result)
// digs/NN-slug.json-> DigRecord
// jev-log.json     -> JevLogEntry[] (one entry per jev HTTP request)

export interface DecisionRecord {
  type: string; // "noul" | "score"
  instructions: string;
  model: string; // "clef"
  answer: Record<string, unknown>; // raw answer object incl. probabilities/legend/confidence
  usage: { input_tokens: number | null; output_tokens: number | null };
  requested_at: string; // ISO 8601 UTC
}

export interface DugResult {
  slug: string;
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null; // noul probability; null only if never scored
  decision: DecisionRecord;
  redo_of: number | null;
}

export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: { query: string; attempt: number; raw_results: number; kept: number; ok?: boolean; error?: string }[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
  note?: string; // e.g. "internal-record subtopic, no dig"
}

export interface OutlineSubtopic {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
  dig: string;
  score?: number;
}

export interface OutlineRecord {
  topic: string;
  ground_source: string;
  subtopics: OutlineSubtopic[];
  validation: {
    metric: string; // "score"
    criteria: string[];
    model: string;
    answers: Record<string, unknown>; // tNN -> raw score answer object
    usage: { input_tokens: number | null; output_tokens: number | null };
    dropped: string[];
    kept: string[];
  };
}

export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens: number | null; output_tokens: number | null };
}

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string };
  decide: { url: string; model: string; note: string };
}
