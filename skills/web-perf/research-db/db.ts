// research-db schema v2 interfaces for the web-perf knowledge corpus mint.
// File -> interface mapping:
//   preflight.json              -> PreflightRecord
//   outline.json                -> OutlineRecord
//   archive.json (JSON array)   -> DugResult
//   digs/<NN>-<slug>.json       -> DigRecord
//   jev-log.json (JSON array)   -> JevLogEntry
export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  answer: Record<string, unknown>;
  usage: { input_tokens: number | null; output_tokens: number | null; note?: string };
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
export interface QueryAttempt {
  query: string;
  attempt: number;
  raw_results: number | null;
  kept: number;
  note?: string;
  error?: string;
}
export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: QueryAttempt[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}
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
    metric: string;
    criteria: string[];
    model: string;
    answers: Record<string, { score: number; probabilities: Record<string, number>; confidence: number; legend: Record<string, string> }>;
    usage: Record<string, unknown>;
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
  attempt: number;
  status: number;
}
export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string; unresponsive_engines: string[] };
  decide: { url: string; model: string; note?: string; probe_answer?: string };
}
