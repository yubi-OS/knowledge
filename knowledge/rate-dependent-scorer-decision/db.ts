// db.ts — TypeScript interfaces for the rate-dependent-scorer-decision research-db (schema v2).
//
// File -> interface mapping:
//   research-db/archive.json          -> DugResult[]
//   research-db/outline.json          -> OutlineRecord
//   research-db/digs/<NN>-<slug>.json -> DigRecord
//   research-db/jev-log.json          -> JevLogEntry[]
//   research-db/preflight.json        -> PreflightRecord

// archive.json: one entry per collected searXNG result.
export interface DugResult {
  query: string;            // seed query that produced the result
  title: string;
  url: string;
  snippet: string;          // truncated result content as collected
  collected_at: string;     // ISO 8601
  weight: number | null;    // noul true-probability; null only if never scored
  decision: DecisionRecord; // the jev decision that produced the weight
  redo_of: number | null;   // index of superseded unweighted entry, else null
}

// The jev decision record embedded in each DugResult.
export interface DecisionRecord {
  type: "noul";             // decision metric used for weighting
  instructions: string;     // exact instructions sent to /api/decide
  model: "clef";
  answer: object;           // raw answer object (type, noul probability)
  usage: { input_tokens: number; output_tokens: number }; // apportioned per question
  requested_at: string;     // ISO 8601
}

// outline.json: topic decomposition plus the score-metric validation record.
export interface OutlineRecord {
  topic: string;
  subtopics: Array<{
    nn: string;             // "01".."08", outline order
    slug: string;
    scope: string;          // one-line scope
    seed_queries: string[]; // 2 web-search seeds per subtopic
  }>;
  validation: {
    metric: "score";
    criteria: string[];     // ["padding: drop", "marginal: ...", "load-bearing: ..."]
    model: "clef";
    answers: Record<string, {
      score: number;
      probabilities: Record<string, number>;
      confidence: number;
      legend: Record<string, string>;
    }>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[];      // nn values with score 0
    kept: string[];         // nn values carried into the dig
  };
}

// digs/<NN>-<slug>.json: per-subtopic dig record.
export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: Array<{
    query: string;
    attempt: number;        // 1 for the initial dig, 2+ for redos
    raw_results: number;    // result count returned by searXNG
    kept: number;           // results kept (top 6)
  }>;
  redo_count: number;
  redo_log: Array<{ attempt: number; reason: string; new_queries: string[] }>;
  results_kept: string[];   // urls carried into authoring
  outcome: "authored" | "skipped";
  skip_reason?: string;     // present only when outcome === "skipped"
}

// jev-log.json: one entry per jev HTTP request.
export interface JevLogEntry {
  requested_at: string;     // ISO 8601
  endpoint: string;         // "POST /api/decide"
  state: string;            // decision state namespace
  model: string;            // "clef"
  n_questions: number;
  question_names: string[];
  metric_types: string[];   // "score" | "noul" per question
  usage: { input_tokens: number; output_tokens: number } | null;
}

// preflight.json: endpoint health snapshot taken before the dig.
export interface PreflightRecord {
  date: string;             // "2026-10-05"
  searxng: {
    url: string;
    probe_results: { status: number; count: number };
    unresponsive_engines: string[];
  };
  decide: {
    url: string;
    model: string;
    probe_answer: object;   // raw answer object from the score probe
  };
}
