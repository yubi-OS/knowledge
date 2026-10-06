// db.ts - TypeScript interfaces for the yubios-stress-test-assertions research-db.
// File -> interface mapping:
//   preflight.json                -> PreflightRecord
//   outline.json                  -> OutlineRecord
//   archive.json                  -> DugResult[]
//   digs/NN-<slug>.json           -> DigRecord
//   jev-log.json                  -> JevLogEntry[]

/** research-db/preflight.json */
export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: number;
    unresponsive_engines: unknown;
  };
  decide: {
    url: string;
    model: string | null;
    probe_answer: unknown;
  };
}

/** research-db/outline.json */
export interface OutlineRecord {
  topic: string;
  subtopics: Array<{
    nn: number;
    slug: string;
    scope: string;
    seed_queries: string[];
  }>;
  validation: {
    metric: "score";
    criteria: string[];
    model: string | null;
    answers: Record<string, unknown>;
    usage: { input_tokens: number; output_tokens: number } | null;
    dropped: number[];
    kept: number[];
  };
  validation_note?: string;
}

/** One collected search result, with its jev weighting decision. research-db/archive.json is DugResult[]. */
export interface DugResult {
  nn: number;
  slug: string;
  qidx: number;
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord;
  redo_of: number | null;
}

/** The full record of one jev decision (embedded in DugResult.decision). */
export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: string;
  answer: unknown;
  usage: { input_tokens: number | null; output_tokens: number | null };
  requested_at: string;
}

/** research-db/digs/NN-<slug>.json */
export interface DigRecord {
  nn: number;
  slug: string;
  scope: string;
  queries_attempted: Array<{
    query: string;
    attempt: number;
    raw_results: number | null;
    kept: number;
  }>;
  redo_count: number;
  redo_log: Array<{
    attempt: number;
    reason: string;
    new_queries: string[];
  }>;
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

/** One jev HTTP request. research-db/jev-log.json is JevLogEntry[]. */
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
