// Type interfaces for the sealed-uki-vm-debug research-db (schema v2).
// File -> interface mapping:
//   research-db/preflight.json          -> PreflightRecord
//   research-db/outline.json            -> OutlineRecord
//   research-db/archive.json            -> DugResult[] (one entry per collected result)
//   research-db/digs/<NN>-<slug>.json   -> DigRecord
//   research-db/jev-log.json            -> JevLogEntry[] (one entry per jev HTTP request)

export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: string;
    unresponsive_engines?: unknown;
  };
  decide: {
    url: string;
    model: string;
    probe_answer?: string;
    note?: string;
  };
}

export interface OutlineSubtopic {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
  validation_score?: number;
  validation_bucket?: number;
}

export interface OutlineRecord {
  topic: string;
  source_doc: string;
  subtopics: OutlineSubtopic[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, {
      score: number;
      probabilities: Record<string, number>;
      confidence: number;
      legend: Record<string, string>;
    }>;
    usage: { input_tokens: number; output_tokens: number; cost?: number };
    dropped: string[];
    kept: string[];
    notes?: string;
  };
}

export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: {
    type: "noul";
    instructions: string;
    model: string;
    endpoint?: string;
    answer: unknown; // raw answer object as returned by the decision model
    usage: { input_tokens: number; output_tokens: number; note?: string };
    requested_at: string;
  };
  redo_of: number | null;
}

export interface DigQueryAttempt {
  query: string;
  attempt: number;
  raw_results: { title: string; url: string; snippet: string }[];
  kept: string[];
}

export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: DigQueryAttempt[];
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
  usage: { input_tokens: number; output_tokens: number };
}
