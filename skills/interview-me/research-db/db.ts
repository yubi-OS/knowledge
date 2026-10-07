// research-db schema interfaces (schema v2)
// File mapping:
//   research-db/preflight.json -> PreflightRecord
//   research-db/outline.json   -> OutlineRecord
//   research-db/archive.json   -> DugResult[]
//   research-db/digs/<NN>-<slug>.json -> DigRecord
//   research-db/jev-log.json   -> JevLogEntry[]

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string; unresponsive_engines?: string[] };
  decide: { url: string; model: string; note?: string; probe_answer?: unknown };
}

export interface OutlineSubtopic {
  nn: string;
  slug: string;
  scope: string;
  seed_queries?: string[];
}

export interface OutlineRecord {
  topic: string;
  ground_source: string;
  subtopics: OutlineSubtopic[];
  validation: {
    metric: string;
    criteria: string[];
    model: string;
    answers: Record<string, { score: number; legend: Record<string, string>; probabilities: Record<string, number>; confidence: number }>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[];
    kept: string[];
  };
}

export interface DecisionRecord {
  type: string;
  instructions: string;
  model: string;
  answer: unknown;
  usage: { input_tokens: number; output_tokens: number } | null;
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
  redo_of: number | null;
}

export interface DigAttempt {
  query: string;
  attempt: number;
  raw_results: number;
  kept: number;
  note?: string;
  error?: string;
}

export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: DigAttempt[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  note?: string;
  skip_reason?: string;
}

export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens?: number; output_tokens?: number };
}
