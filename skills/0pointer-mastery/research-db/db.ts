// db.ts - TypeScript interfaces for the 0pointer-mastery research-db (schema v2).
// File -> interface mapping:
//   preflight.json                       -> PreflightRecord
//   outline.json                         -> OutlineRecord
//   archive.json (entries array)         -> DugResult
//   digs/<NN>-<slug>.json                -> DigRecord
//   jev-log.json (array)                 -> JevLogEntry

export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: string;
  };
  decide: {
    url: string;
    model: string;
    note: string;
  };
}

export interface OutlineSubtopic {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
  dig: string;
}

export interface OutlineDroppedCandidate {
  nn: string;
  slug: string;
  score: number;
  reason: string;
}

export interface OutlineRecord {
  topic: string;
  ground_source: string;
  subtopics: OutlineSubtopic[];
  dropped_candidates: OutlineDroppedCandidate[];
  validation: {
    metric: "score";
    criteria: string[];
    banding_rule: string;
    model: string;
    endpoint: string;
    answers: Record<string, { score: number; probabilities: Record<string, number>; confidence: number }>;
    legend: Record<string, string>;
    usage: { input_tokens: number; output_tokens: number };
    kept: string[];
    dropped: string[];
    kept_notes: Record<string, string>;
  };
  requested_at: string;
}

export interface DecisionRecord {
  type: string;
  instructions: string;
  model: string;
  answer: unknown;
  usage: { input_tokens: number; output_tokens: number } | null;
  requested_at: string;
}

export interface DugResult {
  nn: string;
  slug: string;
  tag: string;
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord;
  redo_of: string | null;
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
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens: number; output_tokens: number; cost?: number } | null;
  note?: string;
}
