// research-db/db.ts — TypeScript interfaces matching every shape in this research DB.
// File mapping:
//   preflight.json -> PreflightRecord
//   outline.json   -> OutlineRecord (with ValidationBlock)
//   archive.json   -> DugResult[] (with DecisionRecord in .decision)
//   digs/<NN>-<slug>.json -> DigRecord
//   jev-log.json   -> JevLogEntry[]

/** preflight.json — connectivity probe taken before digging. */
export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: number;
    unresponsive_engines: string[];
  };
  decide: {
    url: string;
    model: string;
    probe_answer: unknown;
  };
}

/** outline.json — the decomposed topic and its jev score validation. */
export interface OutlineRecord {
  topic: string;
  subtopics: OutlineSubtopic[];
  validation: ValidationBlock;
}

export interface OutlineSubtopic {
  nn: number;
  slug: string;
  scope: string;
  seed_queries: string[];
}

export interface ValidationBlock {
  metric: "score";
  criteria: string[];
  model: string;
  answers: Record<string, ScoreAnswer>;
  usage: Usage | null;
  dropped: number[];
  kept: number[];
}

export interface ScoreAnswer {
  type?: string;
  score?: number;
  legend?: Record<string, string>;
  probabilities?: Record<string, number>;
  confidence?: number;
  [k: string]: unknown;
}

/** archive.json — one entry per collected search result. */
export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  /** jev noul weight in [0,1]; null only if scoring failed after redos. */
  weight: number | null;
  decision: DecisionRecord | null;
  /** index (in this array) of the superseded unweighted entry, when this result was rescored. */
  redo_of: number | null;
  /** internal routing fields (not part of the persisted contract, kept for traceability). */
  _nn?: number;
  _slug?: string;
}

/** The full jev decision record stored per result. */
export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  /** raw answer object exactly as /api/decide returned it. */
  answer: unknown;
  usage: Usage | null;
  requested_at: string;
}

/** digs/<NN>-<slug>.json — per-subtopic dig provenance. */
export interface DigRecord {
  nn: number;
  slug: string;
  scope: string;
  queries_attempted: QueryAttempt[];
  redo_count: number;
  redo_log: RedoEntry[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

export interface QueryAttempt {
  query: string;
  attempt: number;
  raw_results: number;
  kept: number;
}

export interface RedoEntry {
  attempt: number;
  reason: string;
  new_queries: string[];
}

/** jev-log.json — one entry per jev HTTP request. */
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

export interface Usage {
  input_tokens: number;
  output_tokens: number;
}
