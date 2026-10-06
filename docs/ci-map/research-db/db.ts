// Type interfaces for the docs/ci-map research-db (schema v2).
//
// File -> interface mapping:
//   research-db/preflight.json  -> PreflightRecord
//   research-db/outline.json    -> OutlineRecord
//   research-db/archive.json    -> DugResult[]
//   research-db/digs/*.json     -> DigRecord
//   research-db/jev-log.json    -> JevLogEntry[]

export interface DecisionRecord {
  type: "score" | "noul" | "choice";
  instructions: string;
  model: "clef";
  answer: Record<string, unknown>;
  usage?: { input_tokens: number; output_tokens: number };
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
  redo_of: number | null;
}

export interface OutlineSubtopic {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
}

export interface OutlineRecord {
  topic: string;
  ground_source: string;
  subtopics: OutlineSubtopic[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    endpoint: string;
    answers: Record<string, unknown>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[];
    kept: string[];
  };
}

export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  internal_record?: boolean;
  queries_attempted: { query: string; attempt: number; raw_results: number; kept: number }[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
  note?: string;
}

export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  http_status?: number;
  usage?: { input_tokens: number; output_tokens: number };
  error?: string;
}

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string; unresponsive_engines?: string };
  decide: { url: string; model: string; note: string };
}
