// research-db type map for knowledge/days-61-90-willingness-to-pay/
// preflight.json -> PreflightRecord
// outline.json -> OutlineRecord
// archive.json -> DugResult[]
// digs/<NN>-<slug>.json -> DigRecord
// jev-log.json -> JevLogEntry[]

export interface DecisionRecord {
  type: "noul" | "score";
  instructions: string;
  model: string;
  answer: unknown; // raw answer object incl. probabilities/legend/confidence
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string;
}

export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null; // noul probability; null = could not be scored
  decision: DecisionRecord;
  redo_of: number | null; // index of superseded unweighted entry, if rescored
  nn?: string;
  slug?: string;
  redo_dig?: boolean;
}

export interface QueryAttempt {
  query: string;
  attempt: number;
  raw_results: number;
  kept: number;
}

export interface RedoLogEntry {
  attempt: number;
  reason: string;
  new_queries: string[];
}

export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: QueryAttempt[];
  redo_count: number;
  redo_log: RedoLogEntry[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

export interface OutlineAnswer {
  score: number;
  probabilities?: Record<string, number>;
  confidence?: number;
  legend?: unknown;
}

export interface OutlineValidation {
  metric: "score";
  criteria: string[];
  model: string;
  answers: Record<string, OutlineAnswer>;
  usage?: { input_tokens: number; output_tokens: number };
  dropped: string[];
  kept: string[];
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
  validation: OutlineValidation;
}

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

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: number; unresponsive_engines: string[]; note?: string };
  decide: { url: string; model: string; probe_answer: unknown };
}
