// db.ts — TypeScript interfaces matching ALL research-db shapes for knowledge/arm64-zstd-efi-zboot-bcvk.
// File -> interface mapping:
//   research-db/preflight.json      -> PreflightRecord
//   research-db/outline.json        -> OutlineRecord
//   research-db/archive.json        -> DugResult[] (JSON array)
//   research-db/digs/<NN>-<slug>.json -> DigRecord
//   research-db/jev-log.json        -> JevLogEntry[] (JSON array)

/** research-db/preflight.json — environment probe taken before the mint. */
export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: number;
    unresponsive_engines: string[];
  };
  decide: {
    url: string;
    model: string;
    probe_answer: unknown;
  };
}

/** One subtopic from the outline and its validation answer. */
export interface SubtopicEntry {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
}

/** research-db/outline.json — outline decomposition plus the jev score validation. */
export interface OutlineRecord {
  topic: string;
  subtopics: SubtopicEntry[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, unknown>;
    usage: { input_tokens: number; output_tokens: number } | null;
    dropped: string[];
    kept: string[];
  };
}

/** The raw jev decision object stored per result. */
export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: "clef";
  answer: unknown; // raw answer object from /api/decide (may be null if weighting failed after redos)
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string;
}

/** One entry of research-db/archive.json — a collected search result with its weight. */
export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord;
  redo_of: number | null; // index of the superseded unweighted entry, if rescored
}

/** One attempted (or redone) search query within a dig. */
export interface QueryAttempt {
  query: string;
  attempt: number;
  raw_results: number;
  kept: number;
}

/** research-db/digs/<NN>-<slug>.json — per-doc dig record. */
export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: QueryAttempt[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

/** research-db/jev-log.json — one entry per jev HTTP request. */
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
