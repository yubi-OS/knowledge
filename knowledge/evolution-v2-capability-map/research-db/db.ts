// db.ts - TypeScript interfaces for the research-db files of knowledge/evolution-v2-capability-map
// File mapping:
//   research-db/preflight.json  -> PreflightRecord
//   research-db/outline.json    -> OutlineRecord
//   research-db/archive.json    -> DugResult[]
//   research-db/digs/<NN>-<slug>.json -> DigRecord
//   research-db/jev-log.json    -> JevLogEntry[]

export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  answer: Record<string, unknown>; // raw answer object incl. probabilities / legend / confidence
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string; // ISO 8601
}

export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string; // ISO 8601
  weight: number | null; // noul probability; null only if unweighted (should not ship)
  decision: DecisionRecord;
  redo_of: number | null; // index of superseded unweighted entry when rescored
}

export interface QueryAttempt {
  query: string;
  attempt: number;
  raw_results: number;
  kept: number;
}

export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: QueryAttempt[];
  redo_count: number;
  redo_log: Array<{ attempt: number; reason: string; new_queries: string[] }>;
  results_kept: string[]; // urls
  outcome: "authored" | "skipped";
  skip_reason?: string;
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
    answers: Record<string, unknown>; // full score answers incl. probabilities, confidence, legend
    usage: { input_tokens: number; output_tokens: number } | null;
    dropped: string[]; // nn values dropped (score 0)
    kept: string[];    // nn values kept
  };
}

export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: unknown;
    unresponsive_engines: string[];
  };
  decide: {
    url: string;
    model: string;
    probe_answer: unknown;
  };
}

export interface JevLogEntry {
  requested_at: string; // ISO 8601
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens: number; output_tokens: number } | null;
}
