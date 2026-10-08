// research-db/db.ts - TypeScript interfaces for the yubikey-operations research-db (schema v2).
//
// File -> interface mapping:
//   preflight.json        -> PreflightRecord
//   outline.json          -> OutlineRecord
//   archive.json          -> DugResult[] (a JSON array of DugResult)
//   digs/NN-<slug>.json   -> DigRecord (one per subtopic)
//   jev-log.json          -> JevLogEntry[] (a JSON array of JevLogEntry)

/** research-db/preflight.json: environment probes before the mint. */
export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: string;
    unresponsive_engines?: string[];
  };
  decide: {
    url: string;
    model: string;
    probe_answer?: string;
    note?: string;
  };
}

/** One subtopic in the outline, plus the full jev validation record. */
export interface Subtopic {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
}

export interface ScoreAnswer {
  score: number;
  probabilities: Record<string, number>;
  confidence: number;
  legend: Record<string, string>;
}

/** research-db/outline.json: outline decomposition and its jev score validation. */
export interface OutlineRecord {
  topic: string;
  subtopics: Subtopic[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, ScoreAnswer>;
    usage: { input_tokens: number; output_tokens: number; cost?: number };
    dropped: string[];
    kept: string[];
  };
}

/** The raw decision-model answer object stored verbatim per result. */
export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: string;
  answer: unknown;
  usage: { input_tokens: number | null; output_tokens: number | null } | null;
  requested_at: string;
}

/** One entry of research-db/archive.json: a collected search result with its noul weight. */
export interface DugResult {
  query_group: string;
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord | null;
  redo_of: number | null;
}

/** One attempted dig query and what came back. */
export interface QueryAttempt {
  query: string;
  attempt: number;
  raw_results: number;
  kept: number;
}

/** A redo entry logged when a dig was redone with different queries. */
export interface RedoLogEntry {
  attempt: number;
  reason: string;
  new_queries: string[];
}

/** research-db/digs/NN-<slug>.json: the dig record for one subtopic. */
export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: QueryAttempt[];
  redo_count: number;
  redo_log: RedoLogEntry[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

/** One entry of research-db/jev-log.json: one jev HTTP request. */
export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens: number | null; output_tokens: number | null };
}
