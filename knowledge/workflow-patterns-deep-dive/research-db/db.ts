// db.ts - TypeScript interfaces for the workflow-patterns-deep-dive research-db.
// File mapping:
//   research-db/preflight.json -> PreflightRecord[]
//   research-db/outline.json   -> OutlineRecord
//   research-db/archive.json   -> DugResult[]
//   research-db/digs/*.json    -> DigRecord[]
//   research-db/jev-log.json   -> JevLogEntry[]

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

export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  answer: {
    noul?: number | null;
    score?: number | null;
    probabilities: Record<string, number> | null;
    confidence: number | null;
    legend: string | null;
  };
  usage: { input_tokens: number | null; output_tokens: number | null };
  requested_at: string;
}

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

export interface OutlineRecord {
  topic: string;
  subtopics: { nn: number; slug: string; scope: string; seed_queries: string[] }[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, { score: number | null; probabilities: Record<string, number> | null; confidence: number | null; legend: string | null }>;
    usage: { input_tokens: number | null; output_tokens: number | null };
    dropped: number[];
    kept: number[];
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
  searxng: { url: string; probe_results: Record<string, unknown>; unresponsive_engines: string[] };
  decide: { url: string; model: string; probe_answer: Record<string, unknown> };
}
