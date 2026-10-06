// research-db/db.ts - TypeScript interfaces matching every shape stored in this corpus's research-db.
//
// File -> interface map:
//   preflight.json -> PreflightRecord
//   outline.json   -> OutlineRecord
//   archive.json   -> DugResult[]
//   digs/<NN>-<slug>.json -> DigRecord
//   jev-log.json   -> JevLogEntry[]

// preflight.json
export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string };
  decide: { url: string; model: string; note: string };
}

// outline.json
export interface OutlineSubtopic {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
}
export interface OutlineValidation {
  metric: string;
  criteria: string[];
  model: string;
  answers: Record<string, {
    score: number;
    probabilities: Record<string, number>;
    confidence: number;
    legend?: Record<string, string>;
  }>;
  usage: { input_tokens: number; output_tokens: number } | null;
  dropped: string[];
  kept: string[];
}
export interface OutlineRecord {
  topic: string;
  subtopics: OutlineSubtopic[];
  validation: OutlineValidation;
}

// archive.json
export interface DecisionRecord {
  type: string;
  instructions: string;
  model: string;
  answer: unknown;
  usage: { input_tokens: number; output_tokens: number } | null;
  requested_at: string;
}
export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord;
  redo_of: string | null;
  also_collected_by?: string[];
}

// digs/<NN>-<slug>.json
export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  internal_record?: boolean;
  note?: string;
  queries_attempted: { query: string; attempt: number; raw_results: number; kept: number }[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

// jev-log.json
export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens: number; output_tokens: number; cost?: number } | null;
  status?: number;
}
