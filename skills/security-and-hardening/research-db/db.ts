// db.ts: TypeScript interfaces for the security-and-hardening research-db (schema v2).
//
// File -> interface mapping:
//   research-db/preflight.json            -> PreflightRecord
//   research-db/outline.json              -> OutlineRecord
//   research-db/archive.json              -> DugResult[] (JSON array, one entry per collected result)
//   research-db/digs/<NN>-<slug>.json     -> DigRecord
//   research-db/jev-log.json              -> JevLogEntry[]

/** One searXNG search result with its jev noul weighting. One entry per collected result. */
export interface DugResult {
  /** The searXNG query the result was collected under. */
  query: string;
  title: string;
  url: string;
  snippet: string;
  /** ISO 8601 timestamp of collection. */
  collected_at: string;
  /** jev noul probability; null means unweighted (must never ship). */
  weight: number | null;
  /** Full decision-model record backing the weight. */
  decision: DecisionRecord;
  /** Index of the superseded unweighted entry this entry re-scored, or null. */
  redo_of: number | null;
}

/** A single jev decision record (noul weighting here). */
export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: "clef";
  /** The raw answer object returned by the decision model. */
  answer: Record<string, unknown>;
  usage: { input_tokens: number | null; output_tokens: number | null };
  requested_at: string;
}

/** One dig (one subtopic's searXNG work), including redo attempts. */
export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: { query: string; attempt: number; raw_results: number; kept: number; error?: string }[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  /** Present only for internal-record subtopics (no dig run). */
  note?: string;
  /** Present only when the dig is too thin to author and the doc is skipped. */
  skip_reason?: string;
}

/** Outline decomposition of the topic with its jev score validation. */
export interface OutlineRecord {
  topic: string;
  ground_source: string;
  subtopics: { nn: string; slug: string; scope: string; seed_queries: string[] }[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    endpoint: string;
    answers: Record<string, unknown>;
    usage: Record<string, unknown> | null;
    requested_at: string;
    dropped: string[];
    kept: string[];
  };
}

/** Campaign preflight state (searXNG + decide endpoint). */
export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string; unresponsive_engines: string[] };
  decide: { url: string; model: string; probe_answer: string | string[]; note?: string };
}

/** One jev HTTP request, appended per request. */
export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens?: number; output_tokens?: number; cost?: number } | null;
}
