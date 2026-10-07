// research-db/db.ts - TypeScript interfaces for the ideate-solo knowledge corpus research-db (schema v2).
//
// File -> interface mapping:
//   research-db/preflight.json          -> PreflightRecord
//   research-db/outline.json            -> OutlineRecord
//   research-db/archive.json            -> DugResult[] (JSON array of DugResult)
//   research-db/digs/<NN>-<slug>.json   -> DigRecord (one per kept subtopic)
//   research-db/jev-log.json            -> JevLogEntry[] (one per jev HTTP request)

/** research-db/preflight.json */
export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: string;
    unresponsive_engines: string[];
  };
  decide: {
    url: string;
    model: string;
    /** note or probe_answer; agent-side probe skipped for speed (orchestrator ran campaign preflight) */
    note?: string;
    probe_answer?: unknown;
  };
}

/** research-db/outline.json */
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
      type: string;
      score: number;
      legend: Record<string, string>;
      probabilities: Record<string, number>;
      confidence: number;
    }>;
    usage: { input_tokens?: number; output_tokens?: number; cost?: number };
    dropped: string[]; // nn values dropped (score 0)
    kept: string[];    // nn values kept
  };
}

/** One collected search result, weighted by the decision model. research-db/archive.json is DugResult[]. */
export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string; // ISO 8601 UTC
  /** noul probability; null only if the result could never be scored (never shipped in this corpus) */
  weight: number | null;
  decision: DecisionRecord;
  /** index of the superseded unweighted archive entry when this result was rescored */
  redo_of: number | null;
}

export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string; // "clef" (typesafe/jev-1.13 behind DefAPI)
  answer: unknown; // raw answer object, e.g. {"type":"noul","noul":0.42}
  usage: { input_tokens: number | null; output_tokens: number | null };
  requested_at: string; // ISO 8601 UTC
}

/** research-db/digs/<NN>-<slug>.json - one per kept subtopic */
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
  results_kept: string[]; // urls
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

/** research-db/jev-log.json - one entry per jev HTTP request */
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
