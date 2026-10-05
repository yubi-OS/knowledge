// db.ts - TypeScript interfaces for the research-db of corpus pq-supply-chain-verification-readiness.
// File -> interface mapping:
//   research-db/preflight.json            -> PreflightRecord
//   research-db/outline.json              -> OutlineRecord (contains OutlineSubtopic[] and OutlineValidation)
//   research-db/archive.json              -> DugResult[] (JSON array)
//   research-db/digs/<NN>-<slug>.json     -> DigRecord
//   research-db/jev-log.json              -> JevLogEntry[] (JSON array)

export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null; // noul probability from clef; null only if unscored
  decision: DecisionRecord;
  redo_of: number | null; // index of superseded unweighted entry when rescored
}

export interface DecisionRecord {
  type: "noul" | "score";
  instructions: string;
  model: string;
  answer: object; // raw answer object: probabilities, legend, confidence, score/noul
  usage: { input_tokens: number; output_tokens: number } | null;
  requested_at: string;
}

export interface DigRecord {
  nn: number;
  slug: string;
  scope: string;
  queries_attempted: { query: string; attempt: number; raw_results: number; kept: { title: string; url: string; content: string }[] }[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

export interface OutlineSubtopic {
  nn: number;
  slug: string;
  scope: string;
  seed_queries: string[];
}

export interface OutlineValidation {
  metric: "score";
  criteria: string[];
  model: string;
  answers: Record<string, { score: number; probabilities: Record<string, number>; confidence: number; legend: Record<string, string> }>;
  usage: { input_tokens: number; output_tokens: number } | null;
}

export interface OutlineRecord {
  topic: string;
  subtopics: OutlineSubtopic[];
  validation: OutlineValidation;
  dropped: number[];
  kept: number[];
}

export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens: number; output_tokens: number } | null;
}

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: number; unresponsive_engines: string[] };
  decide: { url: string; model: string; probe_answer: object };
}
