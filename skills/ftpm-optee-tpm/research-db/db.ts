// research-db/db.ts - TypeScript interfaces for the ftpm-optee-tpm corpus research DB.
// File -> interface mapping:
//   preflight.json  -> PreflightRecord
//   outline.json    -> OutlineRecord
//   archive.json    -> DugResult[] (a JSON array)
//   digs/*.json     -> DigRecord
//   jev-log.json    -> JevLogEntry[] (a JSON array)

/** research-db/preflight.json */
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
    probe_answer?: unknown;
    note?: string;
  };
}

/** research-db/outline.json */
export interface OutlineRecord {
  topic: string;
  ground_source: string;
  subtopics: {
    nn: number;
    slug: string;
    scope: string;
    seed_queries: string[];
  }[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, {
      type: string;
      score: number;
      legend: Record<string, string>;
      probabilities: Record<string, number>;
      confidence: number;
    }>;
    usage: unknown;
    dropped: number[];
    kept: number[];
  };
}

/** One collected search result; research-db/archive.json is DugResult[]. */
export interface DugResult {
  query: string;
  nn: number;
  slug: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  /** noul probability; null until weighted. */
  weight: number | null;
  decision: DecisionRecord | null;
  /** index of the superseded unweighted entry when rescored. */
  redo_of: number | null;
}

/** research-db/archive.json entries carry this in `decision`. */
export interface DecisionRecord {
  type: "noul" | "score";
  instructions: string;
  model: string;
  answer: unknown;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
  requested_at: string;
}

/** research-db/digs/<NN>-<slug>.json */
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
  redo_log: {
    attempt: number;
    reason: string;
    new_queries: string[];
  }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

/** research-db/jev-log.json is JevLogEntry[]; one entry per jev HTTP request. */
export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  decision_type: "score" | "noul";
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}
