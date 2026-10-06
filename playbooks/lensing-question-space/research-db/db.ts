// db.ts - TypeScript interfaces matching every file under playbooks/lensing-question-space/research-db/
// File -> interface map:
//   research-db/preflight.json  -> PreflightRecord
//   research-db/outline.json    -> OutlineRecord
//   research-db/archive.json    -> DugResult[] (array)
//   research-db/digs/*.json     -> DigRecord
//   research-db/jev-log.json    -> JevLogEntry[] (array)

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string; unresponsive_engines: unknown[] };
  decide: { url: string; model: string; note?: string; probe_answer?: unknown };
}

export interface OutlineSubtopic {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
}

export interface OutlineValidation {
  metric: "score";
  criteria: string[];
  model: string;
  answers: Record<string, { score: number; probabilities?: Record<string, number>; confidence: number; legend?: Record<string, string> }>;
  usage: { input_tokens: number | null; output_tokens: number | null };
  dropped: string[];
  kept: string[];
}

export interface OutlineRecord {
  topic: string;
  subtopics: OutlineSubtopic[];
  validation: OutlineValidation | null;
}

export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: string;
  answer: unknown; // raw answer object from the decision model
  usage: { input_tokens: number | null; output_tokens: number | null };
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
  subtopic?: string; // staging convenience key (NN-slug) used during the mint
}

export interface QueryAttempt {
  query: string;
  attempt: number;
  raw_results: number;
  kept: number;
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

export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage?: { input_tokens: number | null; output_tokens: number | null };
}
