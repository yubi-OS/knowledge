// db.ts - TypeScript interfaces for the research-db of knowledge/lensing-question-space-findings
// File -> interface mapping:
//   research-db/preflight.json          -> PreflightRecord
//   research-db/outline.json            -> OutlineRecord
//   research-db/archive.json            -> DugResult[] (JSON array)
//   research-db/digs/<NN>-<slug>.json   -> DigRecord
//   research-db/jev-log.json            -> JevLogEntry[] (JSON array)

/** research-db/preflight.json - endpoint health probes taken before the mint ran. */
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

/** research-db/outline.json - the decomposed outline plus the jev score validation. */
export interface OutlineRecord {
  topic: string;
  subtopics: SubtopicSpec[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, ScoreAnswer>;
    usage: Usage | null;
    dropped: string[];
    kept: string[];
  };
}

export interface SubtopicSpec {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
}

export interface ScoreAnswer {
  score: number;
  probabilities: Record<string, number>;
  confidence: number;
  legend?: Record<string, string>;
}

export interface Usage {
  input_tokens: number;
  output_tokens: number;
}

/** research-db/archive.json entry - one kept dig result with its full jev decision record. */
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
  type: "noul";
  instructions: string;
  model: string;
  answer: unknown;
  usage: Usage | null;
  requested_at: string | null;
}

/** research-db/digs/<NN>-<slug>.json - per-doc dig ledger. */
export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: {
    query: string;
    attempt: number;
    raw_results: number;
    kept: number;
  }[];
  redo_count: number;
  redo_log: {
    attempt: number;
    reason: string;
    new_queries: string[];
  }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

/** research-db/jev-log.json entry - one jev HTTP request. */
export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: Usage | null;
}
