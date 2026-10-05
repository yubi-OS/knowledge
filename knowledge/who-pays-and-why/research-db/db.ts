// Type interfaces for the who-pays-and-why research-db (schema v2).
// File mapping:
//   research-db/preflight.json -> PreflightRecord
//   research-db/outline.json   -> OutlineRecord
//   research-db/archive.json   -> DugResult[] (JSON array)
//   research-db/digs/*.json    -> DigRecord (one per doc)
//   research-db/jev-log.json   -> JevLogEntry[] (JSON array)

/** One collected search result with its jev noul decision (archive.json). */
export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null; // jev noul probability; >= 0.5 counts as authoritative backing
  decision: DecisionRecord;
  redo_of: number | null; // index of superseded unweighted entry when a result was rescored
}

/** The full jev decision record stored with each result. */
export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: "clef";
  answer: object; // raw answer object as returned by /api/decide (includes noul, legend, confidence when present)
  usage: { input_tokens: number | null; output_tokens: number | null };
  requested_at: string;
}

/** Per-doc dig record (research-db/digs/<NN>-<slug>.json). */
export interface DigRecord {
  nn: string; // zero-padded outline order, e.g. "01"
  slug: string;
  scope: string;
  queries_attempted: { query: string; attempt: number; raw_results: number | null; kept: number }[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[]; // URLs kept for authoring
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

/** Topic decomposition plus jev outline validation (outline.json). */
export interface OutlineRecord {
  topic: string;
  subtopics: { nn: string; slug: string; scope: string; seed_queries: string[] }[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, { score: number; probabilities: object; confidence: number; legend: object }>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[];
    kept: string[];
  };
}

/** One jev HTTP request (jev-log.json). */
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

/** Endpoint health probe (preflight.json). */
export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: number; unresponsive_engines: unknown[] };
  decide: { url: string; model: string; probe_answer: object };
}
