// db.ts - TypeScript interfaces for the skills/debugging-and-error-recovery research database (schema v2).
// File mapping:
//   preflight.json        -> PreflightRecord
//   outline.json          -> OutlineRecord
//   archive.json          -> DugResult[] (one entry per collected search result)
//   digs/NN-slug.json     -> DigRecord
//   jev-log.json          -> JevLogEntry[]

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string; unresponsive_engines: unknown[] };
  decide: { url: string; model: string; probe_answer: string };
}

export interface Subtopic {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
  internal_record?: boolean;
}

export interface OutlineValidationAnswer {
  score: number;
  probabilities: Record<string, number>;
  confidence: number;
  legend: Record<string, string>;
}

export interface OutlineRecord {
  topic: string;
  subtopics: Subtopic[];
  validation: {
    metric: string;
    criteria: string[];
    model: string;
    endpoint: string;
    answers: Record<string, OutlineValidationAnswer>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[];
    kept: string[];
  };
}

export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  answer: Record<string, unknown>;
  usage: { input_tokens: number; output_tokens: number } | null;
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
  dig_attempt: number;
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
  nn: string;
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
  question_names?: string[];
  metric_types: string[];
  usage: { input_tokens: number; output_tokens: number };
}
