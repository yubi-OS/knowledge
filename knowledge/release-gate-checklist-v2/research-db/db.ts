// db.ts - TypeScript interfaces for the release-gate-checklist-v2 research-db (schema v2).
// File -> interface mapping:
//   research-db/preflight.json        -> PreflightRecord
//   research-db/outline.json          -> OutlineRecord
//   research-db/archive.json          -> DugResult[] (each entry carries a DecisionRecord)
//   research-db/digs/<NN>-<slug>.json -> DigRecord
//   research-db/jev-log.json          -> JevLogEntry[]

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: number; unresponsive_engines: [string, string][] };
  decide: { url: string; model: string; probe_answer: object };
}

export interface OutlineSubtopic {
  nn: string; slug: string; scope: string; seed_queries: string[];
}

export interface OutlineRecord {
  topic: string;
  subtopics: OutlineSubtopic[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, { type: string; score: number; legend: Record<string, string>; probabilities: Record<string, number>; confidence: number }>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[];
    kept: string[];
  };
}

export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: string;
  answer: { type: string; noul: number };
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string;
}

export interface DugResult {
  nn: string;
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord;
  redo_of: string | null;
}

export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: { query: string; attempt: number; raw_results: number; kept: number; error?: string }[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens: number; output_tokens: number };
}
