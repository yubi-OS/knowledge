// db.ts - TypeScript interfaces for the research-db shapes in this corpus.
// File mapping:
//   preflight.json              -> PreflightRecord
//   outline.json                -> OutlineRecord
//   archive.json                -> DugResult[]
//   digs/<NN>-<slug>.json       -> DigRecord
//   jev-log.json                -> JevLogEntry[]

export interface DecisionRecord {
  type: "noul" | "score";
  instructions: string;
  model: string;
  answer: Record<string, unknown>; // raw answer object as returned by /api/decide, e.g. { type: "noul", noul: 0.96 }
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string; // ISO 8601 UTC
}

export interface DugResult {
  query: string;
  nn: string;      // doc number this result fed
  slug: string;    // doc slug this result fed
  title: string;
  url: string;
  snippet: string;
  collected_at: string; // ISO 8601 UTC
  weight: number | null;  // jev noul probability; non-null for every shipped entry
  decision: DecisionRecord;
  redo_of: number | null; // index of superseded unweighted entry when rescored
}

export interface OutlineSubtopic {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
}

export interface OutlineRecord {
  topic: string;
  subtopics: OutlineSubtopic[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, unknown>; // raw /api/decide answers keyed by tNN
    usage: { input_tokens: number; output_tokens: number } | null;
    dropped: string[]; // nn values with score 0
    kept: string[];    // nn values retained
  };
}

export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: { query: string; attempt: number; raw_results: number; kept: number }[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[]; // urls
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

export interface JevLogEntry {
  requested_at: string; // ISO 8601 UTC
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens: number; output_tokens: number };
  status: number;
}

export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: Record<string, unknown>;
    unresponsive_engines: string[];
  };
  decide: {
    url: string;
    model: string;
    probe_answer: Record<string, unknown>;
  };
}
