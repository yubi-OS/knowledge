// db.ts - TypeScript interfaces for the bootc-composefs-sealed-flow research database.
//
// File -> interface mapping:
//   research-db/preflight.json              -> PreflightRecord
//   research-db/outline.json                -> OutlineRecord
//   research-db/archive.json                -> DugResult[] (JSON array)
//   research-db/digs/<NN>-<slug>.json       -> DigRecord
//   research-db/jev-log.json                -> JevLogEntry[] (JSON array)

export interface DecisionRecord {
  type: 'noul' | 'score' | 'choice';
  instructions: string;
  model: string;
  answer: Record<string, unknown>;
  usage: { input_tokens: number; output_tokens: number };
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
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: QueryAttempt[];
  redo_count: number;
  redo_log: RedoLogEntry[];
  results_kept: string[];
  outcome: 'authored' | 'skipped';
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
    metric: 'score';
    criteria: string[];
    model: string;
    answers: Record<string, unknown>;
    usage: { input_tokens: number; output_tokens: number } | null;
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
  usage: { input_tokens: number; output_tokens: number } | null;
}

export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: number | null;
    unresponsive_engines: string[];
  };
  decide: {
    url: string;
    model: string;
    probe_answer: unknown;
  };
}
