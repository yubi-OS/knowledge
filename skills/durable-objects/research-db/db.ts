// research-db interfaces, schema v2. File -> interface mapping:
// preflight.json -> PreflightRecord
// outline.json -> OutlineRecord
// archive.json -> DugResult[]
// digs/<NN>-<slug>.json -> DigRecord
// jev-log.json -> JevLogEntry[]

export interface DecisionAnswer {
  type: string;
  noul?: number;
  probability?: number;
  answer?: boolean | number;
  probabilities?: Record<string, number>;
  confidence?: number;
  legend?: Record<string, string>;
  score?: number;
}

export interface DecisionRecord {
  type: "noul" | "score";
  instructions: string;
  model: string;
  answer: DecisionAnswer;
  usage: { input_tokens: number | null; output_tokens: number | null };
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

export interface QueryAttempt {
  query: string;
  attempt: number;
  raw_results: number;
  kept: number;
}

export interface DigRecord {
  nn: number;
  slug: string;
  scope: string;
  queries_attempted: QueryAttempt[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

export interface OutlineSubtopic {
  nn: number;
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
    answers: Record<string, DecisionAnswer>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: number[];
    kept: number[];
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
  usage: { input_tokens: number | null; output_tokens: number | null };
  note?: string;
}

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string; unresponsive_engines: unknown[] };
  decide: { url: string; model: string; probe_answer: string };
}
