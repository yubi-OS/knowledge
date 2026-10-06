// db.ts - TypeScript interfaces for the evolution-v2-solo research-db.
//
// File -> interface mapping:
//   research-db/preflight.json            -> PreflightRecord
//   research-db/outline.json              -> OutlineRecord
//   research-db/archive.json              -> DugResult[] (a JSON array of collected, weighted results)
//   research-db/digs/<NN>-<slug>.json     -> DigRecord (one per subtopic dig)
//   research-db/jev-log.json              -> JevLogEntry[] (one entry per jev /api/decide HTTP request)

export interface Usage {
  input_tokens: number;
  output_tokens: number;
}

/** A single jev decision record attached to a collected result. */
export interface DecisionRecord {
  /** Metric type used for this decision. */
  type: "noul" | "score" | "choice";
  /** The verbatim instructions sent to the decision model. */
  instructions: string;
  /** Decision model, "clef". */
  model: string;
  /** The raw answer object returned by /api/decide (includes probabilities / confidence). */
  answer: Record<string, unknown>;
  usage: Usage;
  requested_at: string;
}

/** One collected search result, weighted by jev noul. Stored in archive.json. */
export interface DugResult {
  /** The searXNG query that surfaced this result. */
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  /** noul probability; null only if the result could not be scored (never shipped unweighted). */
  weight: number | null;
  decision: DecisionRecord;
  /** Index of the superseded unweighted entry when this result was rescored; null otherwise. */
  redo_of: number | null;
}

/** One searXNG query execution recorded in a DigRecord. */
export interface QueryAttempt {
  query: string;
  attempt: number;
  raw_results: number;
  kept: number;
}

/** One redo logged in a DigRecord. */
export interface RedoLogEntry {
  attempt: number;
  reason: string;
  new_queries: string[];
}

/** One subtopic dig. Stored in research-db/digs/<NN>-<slug>.json. */
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

/** One outline subtopic. Part of OutlineRecord. */
export interface OutlineSubtopic {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
}

/** The jev score validation of the outline. Part of OutlineRecord. */
export interface OutlineValidation {
  metric: "score";
  criteria: string[];
  model: string;
  answers: Record<
    string,
    {
      score: number;
      probabilities: Record<string, number>;
      confidence: number;
      legend: Record<string, string>;
    }
  >;
  usage: Usage;
  dropped: string[];
  kept: string[];
}

/** outline.json. */
export interface OutlineRecord {
  topic: string;
  subtopics: OutlineSubtopic[];
  validation: OutlineValidation;
}

/** One jev HTTP request. Stored in jev-log.json (one entry per request). */
export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: Usage;
}

/** preflight.json. */
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
    probe_answer: Record<string, unknown>;
  };
}
