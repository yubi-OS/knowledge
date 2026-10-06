// Type interfaces for the arm-trusted-firmware-optee research-db (schema v2).
//
// File -> interface mapping:
//   preflight.json            -> PreflightRecord
//   outline.json              -> OutlineRecord
//   archive.json              -> DugResult[] (JSON array, one entry per collected result)
//   digs/NN-<slug>.json       -> DigRecord
//   jev-log.json              -> JevLogEntry[]

export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: string;
    unresponsive_engines: string[];
  };
  decide: {
    url: string;
    model: string;
    probe_answer?: string;
    note?: string;
  };
}

export interface OutlineAnswer {
  score: number;
  probabilities: Record<string, number>;
  confidence: number;
  legend: Record<string, string>;
}

export interface OutlineSubtopic {
  nn: number;
  slug: string;
  scope: string;
  seed_queries: string[];
}

export interface OutlineRecord {
  topic: string;
  subtopics: OutlineSubtopic[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, OutlineAnswer>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: number[];
    kept: number[];
  };
}

// One entry per collected search result. weight is the jev noul probability
// (null only if a result was never scored, which the mint gate forbids).
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

export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  answer: Record<string, unknown>;
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string;
}

export interface DigRecord {
  nn: number;
  slug: string;
  scope: string;
  queries_attempted: {
    query: string;
    attempt: number;
    raw_results: number;
    kept: number;
  }[];
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
