// Typed index over the research-db JSON artifacts for refs-refresh-jev-weighted.
// File -> interface mapping:
//   preflight.json      -> PreflightRecord
//   outline.json        -> OutlineRecord
//   archive.json        -> DugResult[] (each row carries a DecisionRecord)
//   digs/*.json         -> DigRecord
//   jev-log.json        -> JevLogEntry[]

/** preflight.json: endpoint probes taken before the run. */
export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: { status: number; probe_query: string; result_count: number };
    unresponsive_engines: [string, string][];
  };
  decide: {
    url: string;
    model: string;
    probe_answer: { type: string; noul: number };
  };
}

/** outline.json: topic decomposition plus the jev score validation record. */
export interface OutlineRecord {
  topic: string;
  subtopics: {
    nn: string;
    slug: string;
    scope: string;
    seed_queries: string[];
  }[];
  validation: {
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
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[];
    kept: string[];
  };
}

/** archive.json decision record: one jev noul verdict per collected result. */
export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: "clef";
  answer: { type: "noul"; noul: number };
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string;
}

/** archive.json row: one collected (kept) search result with its weight. */
export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord;
  redo_of: null;
}

/** digs/<NN>-<slug>.json: the per-subtopic dig record. */
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
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

/** jev-log.json: one row per HTTP request to /api/decide (the spend ledger). */
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
