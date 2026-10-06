// research-db/db.ts - TypeScript interfaces for the docs/architecture research database.
//
// File -> interface mapping:
//   preflight.json          -> PreflightRecord
//   outline.json            -> OutlineRecord
//   archive.json            -> DugResult[] (one entry per collected dig result)
//   digs/<NN>-<slug>.json   -> DigRecord (one file per subtopic)
//   jev-log.json            -> JevLogEntry[] (one entry per jev HTTP request)

export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: string;
    unresponsive_engines?: string[];
  };
  decide: {
    url: string;
    model: string;
    note?: string;
    probe_answer?: string;
  };
}

export interface OutlineSubtopic {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
}

export interface OutlineValidationAnswer {
  score: number;
  probabilities: Record<string, number>;
  confidence: number;
  legend: Record<string, string>;
}

export interface OutlineRecord {
  topic: string;
  subtopics: OutlineSubtopic[];
  validation: {
    endpoint: string;
    metric: string;
    criteria: string[];
    model: string;
    id?: string;
    answers: Record<string, OutlineValidationAnswer>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[];
    kept: string[];
    drop_note?: string;
  };
}

export interface DugResult {
  nn: string;
  slug: string;
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord | null;
  redo_of: number | string | null;
}

export interface DecisionRecord {
  type: string;
  instructions: string;
  model: string;
  answer: unknown | null;
  usage: { input_tokens: number; output_tokens: number } | null;
  requested_at: string;
}

export interface QueryAttempt {
  query: string;
  attempt: number;
  raw_results: number;
  kept: string[];
}

export interface DigRecord {
  nn: string;
  slug: string;
  scope?: string;
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
  usage: { input_tokens: number; output_tokens: number } | null;
}
