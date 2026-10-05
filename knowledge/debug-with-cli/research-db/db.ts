// research-db/db.ts - TypeScript interfaces for the debug-with-cli knowledge corpus research database.
// Mapping: preflight.json -> PreflightRecord; outline.json -> OutlineRecord;
// archive.json -> DugResult[]; digs/<NN>-<slug>.json -> DigRecord[];
// jev-log.json -> JevLogEntry[].

/** preflight.json - one record of tool health at mint time. */
export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: number; // result count returned by the probe query, -1 on failure
    unresponsive_engines: string[];
  };
  decide: {
    url: string;
    model: string;
    probe_answer: unknown; // raw answer object from the probe question
  };
}

/** outline.json - topic decomposition plus the score-metric validation record. */
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
    answers: Record<string, {
      score: number | null;
      probabilities: Record<string, number> | null;
      confidence: number | null;
      legend: Record<string, string> | null;
    }>;
    usage: { input_tokens: number; output_tokens: number } | null;
    dropped: string[]; // nn values scored 0
    kept: string[];
  };
}

/** archive.json[] - one collected search result with its noul decision record. */
export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null; // clef noul probability; null only if unscored
  decision: DecisionRecord;
  redo_of: number | null; // index of the superseded unweighted entry when rescored
}

/** Shared shape of every jev decision record (inside DugResult.decision). */
export interface DecisionRecord {
  type: "noul" | "score";
  instructions: string;
  model: string;
  answer: unknown; // raw answer object, e.g. { type: "noul", noul: 0.93 }
  usage: { input_tokens: number; output_tokens: number } | null;
  requested_at: string;
}

/** digs/<NN>-<slug>.json - per-doc dig provenance and redo log. */
export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: {
    query: string;
    attempt: number;
    raw_results: number | null;
    kept: number;
  }[];
  redo_count: number;
  redo_log: {
    attempt: number;
    reason: string;
    new_queries: string[];
  }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

/** jev-log.json[] - one entry per jev HTTP request. */
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
