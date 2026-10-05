// research-db/db.ts — TypeScript interfaces matching every shape stored in this research DB.
// File mapping:
//   research-db/preflight.json          -> PreflightRecord
//   research-db/outline.json            -> OutlineRecord
//   research-db/archive.json            -> DugResult[] (one entry per collected searXNG result)
//   research-db/digs/<NN>-<slug>.json   -> DigRecord
//   research-db/jev-log.json            -> JevLogEntry[] (one entry per jev HTTP request)

/** research-db/preflight.json */
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

/** research-db/outline.json */
export interface OutlineRecord {
  topic: string;
  subtopics: Array<{
    nn: number;
    slug: string;
    scope: string;
    seed_queries: [string, string];
  }>;
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
    usage: { input_tokens: number; output_tokens: number } | null;
    requested_at: string;
    dropped: number[];
    kept: number[];
  };
}

/** One collected search result, weighted by the jev noul metric. research-db/archive.json */
export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  /** jev noul probability; null when a decision could not be obtained after redos */
  weight: number | null;
  decision: DecisionRecord;
  /** index of the superseded unweighted entry when this result was rescored */
  redo_of: number | null;
  /** subtopic number (1-based outline order); extension field for joins */
  nn: number;
}

/** A single jev decision record embedded in a DugResult */
export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: string;
  question_name: string;
  answer: unknown;
  usage: { input_tokens: number; output_tokens: number } | null;
  requested_at: string;
}

/** research-db/digs/<NN>-<slug>.json */
export interface DigRecord {
  nn: number;
  slug: string;
  scope: string;
  queries_attempted: Array<{
    query: string;
    attempt: number;
    raw_results: number;
    kept: number;
  }>;
  redo_count: number;
  redo_log: Array<{
    attempt: number;
    reason: string;
    new_queries: string[];
  }>;
  results_kept: string[];
  results_kept_weighted_0_5: number;
  results_weighted_total: number;
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

/** research-db/jev-log.json */
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
