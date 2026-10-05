// db.ts - TypeScript interfaces for the visco-instruments research-db (schema v2).
// File mapping:
//   preflight.json            -> PreflightRecord
//   outline.json              -> OutlineRecord
//   archive.json              -> Array<DugResult>
//   digs/<NN>-<slug>.json     -> DigRecord
//   jev-log.json              -> Array<JevLogEntry>

// archive.json: one entry per collected search result, with its weighting decision.
export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: "clef";
  answer: {
    type: "noul";
    noul: number; // probability the source is a primary/official source worth citing
  } | null;
  usage: { input_tokens: number; output_tokens: number } | null;
  requested_at: string;
}

export interface DugResult {
  nn: string;            // subtopic number, e.g. "03"
  slug: string;          // subtopic slug, e.g. "prony-relaxation-fits"
  query: string;         // searXNG query that produced this result
  title: string;
  url: string;
  snippet: string;
  collected_at: string;  // ISO 8601 UTC
  weight: number | null; // the noul probability; null only if scoring failed after redos
  decision: DecisionRecord;
  redo_of: number | null; // index of the superseded unweighted entry when a result was rescored
}

// digs/<NN>-<slug>.json: the dig record for one subtopic.
export interface QueryAttempt {
  query: string;
  attempt: number;      // 1 = original dig, 2+ = redo
  raw_results: number;  // result count returned by searXNG
  kept: number;         // results kept (top 6)
  error?: string | null;
}

export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: QueryAttempt[];
  redo_count: number;
  redo_log: Array<{ attempt: number; reason: string; new_queries: string[] }>;
  results_kept: string[]; // URLs of weighted results for this subtopic
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

// outline.json: topic decomposition plus its jev validation.
export interface OutlineValidation {
  metric: "score";
  criteria: string[]; // ["padding: drop", "marginal: keep only if the dig comes back strong", "load-bearing: core subtopic"]
  model: string;
  answers: Record<string, {
    type: "score";
    score: number;       // 0/1/2 (float from the calibrated model)
    legend: Record<string, string>;
    probabilities: Record<string, number>;
    confidence: number;
  }>;
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string;
}

export interface OutlineRecord {
  topic: string;
  subtopics: Array<{ nn: string; slug: string; scope: string; seed_queries: string[] }>;
  validation: OutlineValidation;
  dropped: string[]; // nn values scored 0
  kept: string[];
}

// jev-log.json: one entry per jev HTTP request made during the mint.
export interface JevLogEntry {
  requested_at: string;
  endpoint: string;      // "/api/decide"
  state: string;         // the REF sent as "state"
  model: string;         // "clef"
  n_questions: number;
  question_names: string[];
  metric_types: string[]; // "score" | "noul"
  usage: { input_tokens: number | null; output_tokens: number | null } | null;
  attempt?: number;      // 1 unless the request was retried after 429/5xx
  batch?: number | string;
  note?: string;
}

// preflight.json: endpoint health before the mint began.
export interface SearxngProbe {
  query: string;
  status: number;
  ms: number;
  result_count: number;
  sample?: { title: string; url: string };
}

export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: SearxngProbe[];
    unresponsive_engines: Array<[string, string]>;
  };
  decide: {
    url: string;
    model: string;
    probe_answer: unknown; // raw answer object from the probe question
  };
}
