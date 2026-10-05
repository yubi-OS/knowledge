// db.ts - TypeScript interfaces for the research-db files of knowledge/dhi-io-base-image-digest-rotation.
// File mapping:
//   research-db/preflight.json        -> PreflightRecord
//   research-db/outline.json          -> OutlineRecord
//   research-db/archive.json          -> DugResult[]
//   research-db/digs/<NN>-<slug>.json -> DigRecord
//   research-db/jev-log.json          -> JevLogEntry[]

/** research-db/preflight.json: probe results for the two endpoints used during the mint. */
export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: number; unresponsive_engines: string[] };
  decide: { url: string; model: string; probe_answer: unknown };
}

/** research-db/outline.json: topic decomposition plus the jev score validation round. */
export interface OutlineRecord {
  topic: string;
  subtopics: { nn: string; slug: string; scope: string; seed_queries: string[] }[];
  validation: {
    metric: 'score';
    criteria: string[];
    model: string;
    answers: Record<string, { score: number; probabilities?: Record<string, number>; confidence?: number; legend?: Record<string, string> }>;
    usage: { input_tokens: number; output_tokens: number } | null;
    dropped: string[];
    kept: string[];
  };
}

/** One searXNG result collected during the dig, with its jev weighting decision. */
export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord | null;
  redo_of: number | null;
}

/** Full record of one jev decision (noul weighting). */
export interface DecisionRecord {
  type: 'noul';
  instructions: string;
  model: string;
  answer: unknown;
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string;
}

/** research-db/digs/<NN>-<slug>.json: per-subtopic dig record. */
export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: { query: string; attempt: number; raw_results: number; kept: number }[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: 'authored' | 'skipped';
  skip_reason?: string;
}

/** research-db/jev-log.json: one entry per jev HTTP request. */
export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens: number; output_tokens: number } | null;
}
