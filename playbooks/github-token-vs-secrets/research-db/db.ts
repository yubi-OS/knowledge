// research-db/db.ts - TypeScript interfaces matching every shape in this research-db.
//
// File -> interface mapping:
//   preflight.json            -> PreflightRecord
//   outline.json              -> OutlineRecord
//   archive.json (array)      -> DugResult (one entry per collected dig result)
//   digs/<NN>-<slug>.json     -> DigRecord
//   jev-log.json (array)      -> JevLogEntry (one entry per jev HTTP request)

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
    probe_answer: string;
    note?: string;
  };
}

export interface OutlineSubtopic {
  nn: number;
  slug: string;
  scope: string;
  seed_queries: string[];
  note?: string;
}

export interface OutlineAnswer {
  score: number;
  probabilities: Record<string, number>;
  confidence: number;
  legend: Record<string, string>;
}

export interface OutlineRecord {
  topic: string;
  ground_source: string;
  subtopics: OutlineSubtopic[];
  validation: {
    metric: string;
    criteria: string[];
    model: string;
    endpoint: string;
    answers: Record<string, OutlineAnswer>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: number[];
    kept: number[];
    notes?: string;
  };
}

export interface DecisionRecord {
  type: string; // "noul"
  instructions: string;
  model: string; // "typesafe/jev-1.13"
  answer: {
    type: string;
    noul: number;
  };
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
  requested_at: string;
}

export interface DugResult {
  query: string;
  query_file: string; // digs source file base, e.g. 01-decision-matrix-1
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord;
  redo_of: null | number;
}

export interface DigQueryAttempt {
  query: string;
  attempt: number;
  raw_results: string;
  kept: number;
}

export interface DigRedoEntry {
  attempt: number;
  reason: string;
  new_queries: string[];
}

export interface DigRecord {
  nn: number;
  slug: string;
  scope: string;
  queries_attempted: DigQueryAttempt[];
  redo_count: number;
  redo_log: DigRedoEntry[];
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
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}
