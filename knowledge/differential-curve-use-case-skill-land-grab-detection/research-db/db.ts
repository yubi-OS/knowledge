// research-db/db.ts - TypeScript interfaces matching every shape in this research-db.
// File -> interface mapping:
//   preflight.json            -> PreflightRecord
//   outline.json              -> OutlineRecord
//   archive.json              -> DugResult[] (one entry per collected result)
//   digs/<NN>-<slug>.json     -> DigRecord
//   jev-log.json              -> JevLogEntry[]

// preflight.json: one-shot health check of the two external services used by this mint.
export interface PreflightRecord {
  date: string;                       // e.g. "2026-10-05"
  searxng: {
    url: string;                      // endpoint used for all digs
    probe_results: number;            // result count returned by the probe query
    unresponsive_engines: string[];   // engines that failed the probe (empty if healthy)
  };
  decide: {
    url: string;                      // /api/decide endpoint used for all jev calls
    model: string;                    // decision model, e.g. "clef"
    probe_answer: string;             // human-readable probe outcome
  };
}

// outline.json: topic decomposition plus the jev outline-validation record.
export interface OutlineRecord {
  topic: string;
  subtopics: Array<{
    nn: number;                       // doc number
    slug: string;                     // doc slug, e.g. "differential-curve-mechanics"
    scope: string;                    // one-line scope
    seed_queries: string[];           // 2 seed web-search queries
  }>;
  validation: {
    metric: "score";
    criteria: string[];               // lowest-first criteria list
    model: string;                    // e.g. "clef"
    answers: Record<string, {
      score: number;                  // 0 = drop, 1 = marginal, 2 = load-bearing
      legend?: Record<string, string>;
      probabilities?: Record<string, number>;
      confidence?: number;
    }>;
    usage: { input_tokens: number; output_tokens: number } | null;
    dropped: number[];                // nn values with score 0
    kept: number[];                   // nn values kept
  };
}

// archive.json: every web result collected during the dig, with its jev weight.
export interface DugResult {
  query: string;                      // the searXNG query that produced it
  title: string;
  url: string;
  snippet: string;
  collected_at: string;               // ISO timestamp
  weight: number | null;              // noul probability; null until weighted
  decision: DecisionRecord | null;    // full jev decision record
  redo_of: number | null;             // index of superseded unweighted entry, if rescored
}

// archive.json decision block: the raw jev answer for one result.
export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: string;                      // "clef"
  answer: {                           // raw answer object from /api/decide
    noul: number;                     // probability the result is authoritative
    [k: string]: unknown;
  };
  usage: { input_tokens: number | null; output_tokens: number | null };
  requested_at: string;
}

// digs/<NN>-<slug>.json: per-doc dig record including redo history.
export interface DigRecord {
  nn: number;
  slug: string;
  scope: string;
  queries_attempted: Array<{
    query: string;
    attempt: number;                  // 0 = original seed query, 1+ = redo queries
    raw_results: number;
    kept: Array<{ query: string; title: string; url: string; snippet: string }>;
  }>;
  redo_count: number;
  redo_log: Array<{
    attempt: number;
    reason: string;
    new_queries: string[];
  }>;
  results_kept: string[];             // urls kept
  outcome: "authored" | "skipped";
  skip_reason?: string;               // present when outcome is "skipped"
}

// jev-log.json: one entry per /api/decide HTTP request (including outline validation).
export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;                      // corpus REF
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];             // "score" or "noul" per question
  usage: { input_tokens: number | null; output_tokens: number | null } | null;
}
