// db.ts - TypeScript interfaces for the first-90-days-2 research-db (schema v2).
// File mapping:
//   preflight.json                 -> PreflightRecord
//   outline.json                   -> OutlineRecord
//   archive.json                   -> DugResult[] (each carries a DecisionRecord)
//   digs/<NN>-<slug>.json          -> DigRecord
//   jev-log.json                   -> JevLogEntry[]

export interface Usage {
  input_tokens: number | null;
  output_tokens: number | null;
}

// preflight.json
export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: number;
    unresponsive_engines: unknown[];
  };
  decide: {
    url: string;
    model: string | null;
    probe_answer: unknown;
  };
}

// outline.json
export interface OutlineSubtopic {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
}
export interface OutlineRecord {
  topic: string;
  subtopics: OutlineSubtopic[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string | null;
    answers: Record<string, unknown>;
    usage: Usage | null;
    dropped: string[];
    kept: string[];
  };
}

// archive.json
export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: "clef";
  answer: unknown;
  usage: Usage | null;
  requested_at: string;
}
export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord | null;
  redo_of: number | string | null;
  nn: string;
  slug: string;
}

// digs/<NN>-<slug>.json
export interface DigRecord {
  nn: string;
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
  usage: Usage;
}
