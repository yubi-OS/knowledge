// research-db/db.ts — TypeScript interfaces for the research-db files in this corpus.
// File -> interface mapping:
//   preflight.json -> PreflightRecord
//   outline.json   -> OutlineRecord
//   archive.json   -> DugResult[] (one entry per collected search result)
//   digs/<NN>-<slug>.json -> DigRecord
//   jev-log.json   -> JevLogEntry[] (one entry per jev /api/decide HTTP request)

/** research-db/preflight.json */
export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: string;
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
  subtopics: {
    nn: string;           // e.g. "t01"
    slug: string;         // e.g. "search-layer-ai-filters"
    scope: string;        // one-line scope
    seed_queries: string[]; // 2 seed web-search queries
  }[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, {
      score: number;
      probabilities: Record<string, number>;
      confidence: number;
      legend: Record<string, string>;
    }>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[]; // nn values dropped
    kept: string[];    // nn values kept
  };
}

/** research-db/archive.json — array of DugResult */
export interface DugResult {
  query: string;        // the searXNG query that produced this result
  title: string;
  url: string;
  snippet: string;
  collected_at: string; // ISO 8601 UTC
  weight: number | null; // jev noul probability; null if unscored
  decision: DecisionRecord;
  redo_of: number | null; // index of superseded unweighted entry, if rescored
}

/** A stored jev decision record (embedded in DugResult.decision) */
export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: string;        // "clef"
  answer: unknown;      // raw answer object as returned by /api/decide
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string; // ISO 8601 UTC
}

/** research-db/digs/<NN>-<slug>.json */
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
  results_kept: string[]; // urls
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

/** research-db/jev-log.json — array of JevLogEntry */
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
