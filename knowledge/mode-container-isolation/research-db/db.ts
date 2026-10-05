// research-db/db.ts — TypeScript interfaces for the mode-container-isolation research DB.
// File -> interface mapping:
//   preflight.json              -> PreflightRecord
//   outline.json                -> OutlineRecord (with ScoreValidation)
//   archive.json                -> DugResult[]
//   digs/<NN>-<slug>.json       -> DigRecord
//   jev-log.json                -> JevLogEntry[]

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

export interface Subtopic {
  nn: number;
  slug: string;
  scope: string;
  seed_queries: string[];
}

export interface ScoreAnswer {
  type: string;
  score: number;
  legend: Record<string, string>;
  probabilities: Record<string, number>;
  confidence: number;
}

export interface ScoreValidation {
  metric: "score";
  criteria: string[];
  model: string;
  answers: Record<string, ScoreAnswer>;
  usage: { input_tokens?: number; output_tokens?: number };
  dropped: number[];
  kept: number[];
}

export interface OutlineRecord {
  topic: string;
  subtopics: Subtopic[];
  validation: ScoreValidation;
}

export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  answer: unknown;
  usage: { input_tokens?: number | null; output_tokens?: number | null };
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
  redo_of: number | null;
}

export interface QueryAttempt {
  query: string;
  attempt: number;
  raw_results: number;
  kept: number;
}

export interface RedoLogEntry {
  attempt: number;
  reason: string;
  new_queries: string[];
}

export interface DigRecord {
  nn: number;
  slug: string;
  scope: string;
  queries_attempted: QueryAttempt[];
  redo_count: number;
  redo_log: RedoLogEntry[];
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
  metric_types: (string | null)[];
  usage: { input_tokens?: number | null; output_tokens?: number | null };
}
