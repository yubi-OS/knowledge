// research-db schema v2 for knowledge/jev-corpus
// File -> interface mapping:
//   research-db/preflight.json        -> PreflightRecord
//   research-db/outline.json          -> OutlineRecord
//   research-db/archive.json          -> DugResult[] (JSON array)
//   research-db/digs/<NN>-<slug>.json -> DigRecord
//   research-db/jev-log.json          -> JevLogEntry[] (JSON array)

/** research-db/archive.json: one entry per collected search result. */
export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  /** jev noul probability; null only if weighting never completed (mint guardrail forbids shipping this). */
  weight: number | null;
  decision: DecisionRecord | null;
  /** index of the superseded unweighted entry when this result was rescored; null otherwise. */
  redo_of: number | null;
}

/** Embedded in DugResult.decision: the full /api/decide record for one result. */
export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: "clef";
  /** raw answer object as returned by /api/decide, e.g. { type: "noul", noul: 0.79 }. */
  answer: unknown;
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string;
}

/** research-db/digs/<NN>-<slug>.json: one per corpus doc. */
export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: Array<{
    query: string;
    attempt: number;
    raw_results: number;
    kept: number;
  }>;
  redo_count: number;
  redo_log: Array<{ attempt: number; reason: string; new_queries: string[] }>;
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

/** research-db/outline.json. */
export interface OutlineRecord {
  topic: string;
  subtopics: Array<{
    nn: string;
    slug: string;
    scope: string;
    seed_queries: string[];
  }>;
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<
      string,
      { score: number; probabilities: Record<string, number>; confidence: number }
    >;
    usage: { input_tokens: number; output_tokens: number };
    requested_at: string;
    dropped: string[];
    kept: string[];
  };
}

/** research-db/jev-log.json: one entry per /api/decide HTTP request. */
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

/** research-db/preflight.json. */
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
