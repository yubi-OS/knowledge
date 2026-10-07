// Research-db schema v2 interface map for skills/knowledge-corpus-mint/
// File mapping:
//   research-db/preflight.json -> PreflightRecord
//   research-db/outline.json   -> OutlineRecord
//   research-db/archive.json   -> DugResult[]
//   research-db/digs/<NN>-<slug>.json -> DigRecord
//   research-db/jev-log.json   -> JevLogEntry[]

export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  answer: Record<string, unknown>; // raw answer object (probabilities / legend / confidence)
  usage: { input_tokens: number; output_tokens: number; cost?: number };
  requested_at: string;
}

export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord;
  redo_of: number | null; // index of superseded unweighted entry when rescored
  index: number;
  slug: string;
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
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
  note?: string; // e.g. "internal-record subtopic, no dig"
}

export interface OutlineSubtopic {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
  internal_record?: boolean;
}

export interface OutlineRecord {
  topic: string;
  ground_source: string;
  subtopics: OutlineSubtopic[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    endpoint: string;
    answers: Record<string, { type: string; score: number; legend: Record<string, string>; probabilities: Record<string, number>; confidence: number }>;
    usage: { input_tokens: number; output_tokens: number; cost?: number };
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
  usage: { input_tokens: number; output_tokens: number; cost?: number };
}

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string | null; unresponsive_engines: string[] | null };
  decide: { url: string; model: string; note?: string; probe_answer: unknown };
}
