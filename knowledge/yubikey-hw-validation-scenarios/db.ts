// research-db/db.ts - TypeScript interfaces for the yubikey-hw-validation-scenarios research DB
// File mapping:
//   research-db/preflight.json  -> PreflightRecord
//   research-db/outline.json    -> OutlineRecord
//   research-db/archive.json    -> DugResult[] (JSON array of DugResult)
//   research-db/digs/<NN>-<slug>.json -> DigRecord (one per doc)
//   research-db/jev-log.json    -> JevLogEntry[] (JSON array of JevLogEntry)

/** preflight.json - one record, probe results for both services. */
export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: number;
    unresponsive_engines: string[];
  };
  decide: {
    url: string;
    model: string | null;
    probe_answer: unknown;
  };
}

/** outline.json - decomposition and the jev score validation of it. */
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
    criteria: string[];
    model: string | null;
    answers: Record<string, {
      score: number;
      probabilities: Record<string, number> | null;
      confidence: number | null;
      legend: string[];
    }>;
    usage: { input_tokens?: number; output_tokens?: number } | null;
    dropped: string[];
    kept: string[];
  };
}

/** One collected search result with its jev noul weighting decision. archive.json is an array of these. */
export interface DugResult {
  nn: string;
  slug: string;
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord;
  redo_of: number | null;
}

/** The full record of one jev decision (noul weighting or score validation). */
export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  answer: unknown;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
  requested_at: string;
}

/** digs/<NN>-<slug>.json - the per-doc dig record, including any redos. */
export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: Array<{
    query: string;
    attempt: number;
    raw_results: number;
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

/** jev-log.json - one entry per jev HTTP request made during the mint. */
export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string | null;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens?: number; output_tokens?: number } | null;
}
