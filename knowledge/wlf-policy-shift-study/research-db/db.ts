// db.ts - TypeScript interfaces for the wlf-policy-shift-study research database (schema v2).
// File -> interface mapping:
//   research-db/preflight.json        -> PreflightRecord
//   research-db/outline.json          -> OutlineRecord
//   research-db/archive.json          -> DugResult[] (JSON array of DugResult)
//   research-db/digs/<NN>-<slug>.json -> DigRecord
//   research-db/jev-log.json          -> JevLogEntry[] (JSON array of JevLogEntry)

export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: "clef";
  answer: object | null; // raw answer object from /api/decide, including probability value
  usage: {
    input_tokens: number | null;
    output_tokens: number | null;
  };
  requested_at: string; // ISO 8601
}

// One collected search result. archive.json is DugResult[].
export interface DugResult {
  query: string; // searXNG query that produced the result
  title: string;
  url: string;
  snippet: string; // content snippet at collection time
  collected_at: string; // ISO 8601
  weight: number | null; // noul probability; null only if weighting permanently failed
  decision: DecisionRecord;
  redo_of: number | null; // index of superseded unweighted entry when a result was rescored; null when not a rescore
}

// One subtopic dig record. digs/<NN>-<slug>.json is a DigRecord.
export interface DigRecord {
  nn: string; // two-digit outline order, e.g. "01"
  slug: string;
  scope: string;
  queries_attempted: Array<{
    query: string;
    attempt: number; // 1 = first pass, 2+ = redo
    raw_results: number;
    kept: number;
    results?: Array<{ title: string; url: string; content: string }>; // present on redo attempts
  }>;
  redo_count: number;
  redo_log: Array<{
    attempt: number;
    reason: string;
    new_queries: string[];
  }>;
  results_kept: string[]; // urls carried into archive.json with a non-null weight
  outcome: "authored" | "skipped";
  skip_reason?: string; // present when outcome === "skipped"
}

// outline.json shape.
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
    criteria: string[]; // ordered lowest-first
    model: "clef";
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
    dropped: string[]; // nn values dropped (score 0)
    kept: string[]; // nn values kept
  };
}

// One jev /api/decide HTTP request. jev-log.json is JevLogEntry[].
export interface JevLogEntry {
  requested_at: string; // ISO 8601
  endpoint: string;
  state: string;
  model: "clef";
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

// preflight.json shape.
export interface PreflightRecord {
  date: string; // mint date, YYYY-MM-DD
  searxng: {
    url: string;
    probe_results: number; // result count returned by the probe query
    unresponsive_engines: string[];
  };
  decide: {
    url: string;
    model: "clef";
    probe_answer: object; // raw answer from the probe question
  };
}
