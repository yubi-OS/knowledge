// research-db type map for knowledge/yubios-reproducibility-equivalents
//
// preflight.json      -> PreflightRecord
// outline.json        -> OutlineRecord
// archive.json        -> DugResult[] (top-level JSON array)
// digs/<nn>-<slug>.json -> DigRecord (one file per subtopic)
// jev-log.json        -> JevLogEntry[] (top-level JSON array)

/** preflight.json: endpoint health probes taken before the mint. */
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
    probe_answer: number | null;
  };
}

/** outline.json: the decomposed outline plus its jev score validation. */
export interface OutlineRecord {
  topic: string;
  subtopics: {
    nn: string;
    slug: string;
    scope: string;
    seed_queries: string[];
  }[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<
      string,
      {
        score: number;
        probabilities: Record<string, number> | null;
        confidence: number | null;
        legend: Record<string, string> | null;
      }
    >;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[];
    kept: string[];
  };
}

/** One jev-weighted search result. archive.json is DugResult[]. */
export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: string;
  answer: Record<string, unknown>;
  /** Batch-level usage apportioned evenly across the batch's questions. */
  usage: { input_tokens: number; output_tokens: number } | null;
  requested_at: string | null;
}

export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord;
  /** Index of the superseded unweighted entry this result was rescored over; null when fresh. */
  redo_of: number | null;
}

/** digs/<nn>-<slug>.json: per-subtopic dig provenance. */
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
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

/** jev-log.json: one entry per /api/decide HTTP request. */
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
