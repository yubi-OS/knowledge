// Mapping: file -> interface
// research-db/preflight.json -> PreflightRecord
// research-db/outline.json -> OutlineRecord
// research-db/archive.json -> DugResult[] (JSON array)
// research-db/digs/<NN>-<slug>.json -> DigRecord
// research-db/jev-log.json -> JevLogEntry[] (JSON array)

export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string; // ISO 8601 UTC
  weight: number | null; // jev noul probability
  decision: DecisionRecord;
  redo_of: string | null; // index of superseded unweighted entry, or null
}

export interface DecisionRecord {
  type: string; // "noul" | "score" | "choice"
  instructions: string;
  model: string; // "clef"
  answer: Record<string, unknown>; // raw answer object (noul: {type, noul})
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string; // ISO 8601 UTC
}

export interface DigRecord {
  nn: string; // doc number, zero-padded
  slug: string;
  scope: string;
  queries_attempted: { query: string; attempt: number; raw_results: number; kept: number }[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[]; // urls
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

export interface OutlineRecord {
  topic: string;
  subtopics: { nn: string; slug: string; scope: string; seed_queries: string[] }[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, { score: number | null; probabilities: Record<string, number>; confidence: number | null; legend: unknown }>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[];
    kept: string[];
  };
}

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

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: number; unresponsive_engines: string[] };
  decide: { url: string; model: string; probe_answer: Record<string, unknown> };
}
