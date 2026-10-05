// research-db/db.ts — TypeScript interfaces for every file in this research-db.
// File -> interface mapping:
//   preflight.json        -> PreflightRecord
//   outline.json          -> OutlineRecord
//   archive.json          -> DugResult[] (a JSON array of DugResult entries)
//   digs/NN-slug.json     -> DigRecord
//   jev-log.json          -> JevLogEntry[] (a JSON array of JevLogEntry entries)

// preflight.json: one record with endpoint probes for searXNG and /api/decide.
export interface PreflightRecord {
  date: string;                                  // mint date, e.g. "2026-10-05"
  searxng: {
    url: string;                                 // searXNG webhook endpoint
    probe_results: number;                       // result count on the probe query
    unresponsive_engines: string[];              // engines/errors observed during probe
  };
  decide: {
    url: string;                                 // jev /api/decide endpoint
    model: string;                               // decision model, "clef"
    probe_answer: unknown;                       // raw probe response object
  };
}

// outline.json: topic, subtopics, and the jev score validation of the outline.
export interface OutlineRecord {
  topic: string;                                 // full corpus topic line
  subtopics: Array<{
    nn: string;                                  // two-digit outline order, "01".."08"
    slug: string;                                // url-safe subtopic slug
    scope: string;                               // one-line scope
    seed_queries: string[];                      // 2 seed web-search queries
  }>;
  validation: {
    metric: "score";                             // metric used, criteria lowest-first
    criteria: string[];                          // ["padding: drop", "marginal: ...", "load-bearing: ..."]
    model: string;                               // "clef"
    answers: Record<string, {                    // keyed by t01..tNN
      score: number;                             // 0/1/2 (returned as float in [0,2])
      probabilities: Record<string, number>;     // per-criterion probabilities
      confidence: number;                        // model confidence in [0,1]
      legend: Record<string, string>;            // score -> label
    }>;
    usage: { input_tokens: number; output_tokens: number } | null;
    dropped: string[];                           // question names scored 0
    kept: string[];                              // question names scored > 0
  };
}

// archive.json entry: one collected search result with its jev weighting decision.
export interface DugResult {
  query: string;                                 // the dig query that produced this result
  title: string;                                 // result title
  url: string;                                   // result URL
  snippet: string;                               // truncated content snippet
  collected_at: string;                          // ISO 8601 UTC
  weight: number | null;                         // noul weight in [0,1]; null only if unscored
  decision: DecisionRecord | null;               // full jev decision record backing the weight
  redo_of: number | null;                        // archive index of the superseded unweighted entry
                                                 // (own index when this entry was rescored)
}

// decision field of a DugResult: the full record of one jev request.
export interface DecisionRecord {
  type: "noul" | "score" | "choice";             // metric type
  instructions: string;                          // exact instructions sent
  model: string;                                 // "clef"
  answer: unknown;                               // raw answer object (noul: {noul}; score: {score, probabilities, confidence, legend})
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string;                          // ISO 8601 UTC
}

// digs/NN-slug.json: per-subtopic dig record.
export interface DigRecord {
  nn: string;                                    // outline order
  slug: string;                                  // subtopic slug
  scope: string;                                 // one-line scope
  queries_attempted: Array<{
    query: string;                               // the query string
    attempt: number;                             // 1 for first try, 2+ for redos
    raw_results: number;                         // raw result count returned
    kept: number;                                // results kept (top 6)
  }>;
  redo_count: number;                            // number of dig redos
  redo_log: Array<{                              // only populated on dig redos
    attempt: number;
    reason: string;                              // why the dig was redone (too thin, etc.)
    new_queries: string[];                       // replacement queries used
  }>;
  results_kept: string[];                        // URLs kept across all queries
  outcome: "authored" | "skipped";               // authored = doc written; skipped = recorded as gap
  skip_reason?: string;                          // required when outcome is "skipped"
}

// jev-log.json entry: one entry per jev HTTP request made during the mint.
export interface JevLogEntry {
  requested_at: string;                          // ISO 8601 UTC
  endpoint: string;                              // /api/decide URL
  state: string;                                 // jev state, the corpus REF
  model: string;                                 // "clef"
  n_questions: number;                           // question count in the request
  question_names: string[];                      // e.g. ["t01"] or ["r01".."r05"]
  metric_types: string[];                        // per-question metric types
  usage: { input_tokens: number; output_tokens: number } | null;
}
