// db.ts - TypeScript interfaces for the research-db file set.
// archive.json -> DugResult[] (one entry per collected search result)
// outline.json -> OutlineRecord
// preflight.json -> PreflightRecord
// digs/<NN>-<slug>.json -> DigRecord
// jev-log.json -> JevLogEntry[]

export interface DecisionRecord {
  type: "noul" | "score";
  instructions: string;
  model: string;
  answer: Record<string, unknown>;
  usage: { input_tokens: number; output_tokens: number } | null;
  requested_at: string;
}

// archive.json
export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord | null;
  redo_of: number | null;
}

// outline.json
export interface OutlineRecord {
  topic: string;
  subtopics: { nn: number; slug: string; scope: string; seed_queries: string[] }[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, Record<string, unknown>>;
    usage: Record<string, unknown> | null;
    dropped: number[];
    kept: number[];
  };
}

// preflight.json
export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: Record<string, unknown>; unresponsive_engines: string[] };
  decide: { url: string; model: string; probe_answer: Record<string, unknown> };
}

// digs/<NN>-<slug>.json
export interface DigRecord {
  nn: number;
  slug: string;
  scope: string;
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
  usage: { input_tokens: number; output_tokens: number } | null;
  note?: string;
}
