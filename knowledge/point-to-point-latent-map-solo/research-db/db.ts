// Type interfaces for the point-to-point-latent-map-solo research DB.
// File -> interface mapping:
//   research-db/preflight.json -> PreflightRecord
//   research-db/outline.json   -> OutlineRecord
//   research-db/archive.json   -> DugResult[] (one entry per collected result)
//   research-db/digs/*.json    -> DigRecord
//   research-db/jev-log.json   -> JevLogEntry[] (one entry per jev HTTP request)

export interface DecisionRecord {
  type: "noul" | "score";
  instructions: string;
  model: string;
  answer: unknown; // raw answer object from /api/decide (probability object or score object)
  usage: { input_tokens: number; output_tokens: number } | null;
  requested_at: string;
}

export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null; // probability from the noul decision; >= 0.5 = authoritative
  decision: DecisionRecord;
  redo_of: number | null; // index of the superseded unweighted entry, when rescored
}

export interface QueryAttempt {
  query: string;
  attempt: number; // 1 = original, 2 = redo with different queries
  raw_results: number; // total results returned by searXNG for that query
  kept: number; // results kept (top 6 per query, deduped)
}

export interface DigRecord {
  nn: number;
  slug: string;
  scope: string;
  queries_attempted: QueryAttempt[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[]; // URLs of kept results, in archive order
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

export interface ScoreAnswer {
  type: "score";
  score: number; // continuous 0..2 on the legend scale
  legend: { "0": string; "1": string; "2": string };
  probabilities: { "0": number; "1": number; "2": number };
  confidence: number;
}

export interface OutlineRecord {
  topic: string;
  subtopics: { nn: number; slug: string; scope: string; seed_queries: string[] }[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, ScoreAnswer>;
    usage: { input_tokens: number; output_tokens: number } | null;
    dropped: number[];
    kept: number[];
    note?: string;
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
  usage: { input_tokens: number; output_tokens: number } | null;
}

export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: number;
    unresponsive_engines: unknown[];
  };
  decide: {
    url: string;
    model: string | null;
    probe_answer: unknown;
  };
}
