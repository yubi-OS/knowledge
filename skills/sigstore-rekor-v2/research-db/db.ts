// research-db schema v2 - file -> interface mapping
// preflight.json -> PreflightRecord
// outline.json -> OutlineRecord
// archive.json -> DugResult[]
// digs/<NN>-<slug>.json -> DigRecord
// jev-log.json -> JevLogEntry[]
// Each archive entry's usage/requested_at are recorded at DefAPI request batch
// level (see JevLogEntry); per-entry fields carry the batch totals.

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
    probe_answer?: string;
    note?: string;
  };
}

export interface OutlineSubtopic {
  nn: number;
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
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, OutlineValidationAnswer>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: number[];
    kept: number[];
  };
}

export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: "clef";
  answer: unknown; // raw DefAPI answer object, e.g. { type: "noul", noul: 0.83 }
  usage: { input_tokens: number; output_tokens: number; scope?: string };
  requested_at: string | null;
  note?: string;
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

export interface DigQueryAttempt {
  query: string;
  attempt: number;
  raw_results: number;
  kept: number;
}

export interface DigRecord {
  nn: number;
  slug: string;
  scope: string;
  queries_attempted: DigQueryAttempt[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
  note?: string;
}

export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens: number; output_tokens: number };
}
