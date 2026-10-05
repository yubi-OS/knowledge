// research-db type interfaces for knowledge/libvfio-user-bundle-decision (schema v2)
// File -> interface mapping:
//   preflight.json        -> PreflightRecord
//   outline.json          -> OutlineRecord
//   archive.json          -> DugResult[]  (one JSON array of DugResult entries)
//   digs/<NN>-<slug>.json -> DigRecord
//   jev-log.json          -> JevLogEntry[] (one JSON array of JevLogEntry)
//   db.ts                 -> this file (no record)

/** preflight.json: connectivity and model probes before the mint. */
export interface PreflightRecord {
  date: string;                       // mint date, YYYY-MM-DD
  searxng: {
    url: string;                      // searXNG webhook endpoint
    probe_results: number;            // result count returned by the probe query
    unresponsive_engines: string[];   // engines that failed the probe
  };
  decide: {
    url: string;                      // /api/decide endpoint
    model: string;                    // decision model id (clef)
    probe_answer: unknown;            // raw answer object from the probe question
  };
}

/** outline.json: topic decomposition plus the score-metric validation outcome. */
export interface OutlineRecord {
  topic: string;
  subtopics: Array<{
    nn: number;                       // outline order, 1-based
    slug: string;
    scope: string;                    // one-line scope of the subtopic doc
    seed_queries: string[];           // 2 seed web-search queries
    score?: number;                   // jev score after validation (0/1/2 scale)
  }>;
  validation: {
    metric: 'score';
    criteria: string[];               // criteria lowest-first
    model: string;
    answers: Record<string, unknown>; // t01..tNN raw answer objects
    usage: { input_tokens: number; output_tokens: number };
    dropped: number[];                // nn values dropped (score 0)
    kept: number[];                   // nn values kept
  };
}

/** archive.json entry: one collected search result with its noul weighting. */
export interface DugResult {
  query: string;                      // the dig query that produced this result
  title: string;
  url: string;
  snippet: string;                    // search-result content snippet
  collected_at: string;               // ISO 8601 UTC
  weight: number | null;              // noul probability; null until weighted
  decision: DecisionRecord | null;    // full decision record backing the weight
  redo_of: number | null;             // archive index of the superseded entry, if rescored
  nn?: number;                        // subtopic this result belongs to
  slug?: string;                      // subtopic slug this result belongs to
}

/** decision.answer payload + usage, stored per result and per request. */
export interface DecisionRecord {
  type: 'noul' | 'score' | 'choice';  // metric type used for this decision
  instructions: string;               // exact instructions sent to the model
  model: string;                      // 'clef'
  answer: unknown;                    // raw answer object (e.g. {type, noul} or {type, score, probabilities, confidence, legend})
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string;               // ISO 8601 UTC
}

/** digs/<NN>-<slug>.json: the per-subtopic dig record. */
export interface DigRecord {
  nn: number;
  slug: string;
  scope: string;
  queries_attempted: Array<{
    query: string;
    attempt: number;                  // 1 = original dig, 2+ = redo round
    raw_results: number;              // raw result count from searXNG
    kept: number;                     // results kept (top 6 per query)
  }>;
  redo_count: number;                 // how many redo rounds were run
  redo_log: Array<{
    attempt: number;
    reason: string;
    new_queries: string[];
  }>;
  results_kept: string[];             // urls kept across all attempts
  outcome: 'authored' | 'skipped';
  skip_reason?: string;               // present when outcome is 'skipped'
}

/** jev-log.json entry: one jev /api/decide HTTP request. */
export interface JevLogEntry {
  requested_at: string;               // ISO 8601 UTC
  endpoint: string;                   // endpoint plus human label
  state: string;                      // state passed to /api/decide (the REF)
  model: string;                      // 'clef'
  n_questions: number;
  question_names: string[];
  metric_types: string[];             // one per question
  usage: { input_tokens: number; output_tokens: number };
}
