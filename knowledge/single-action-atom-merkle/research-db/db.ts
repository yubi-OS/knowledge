// db.ts - TypeScript interfaces for the research-db files of knowledge/single-action-atom-merkle.
// File mapping: preflight.json -> PreflightRecord; outline.json -> OutlineRecord;
// archive.json -> DugResult[]; digs/<NN>-<slug>.json -> DigRecord; jev-log.json -> JevLogEntry[].

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: number; unresponsive_engines: string[] };
  decide: { url: string; model: string; probe_answer: number | null };
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
    metric: string;
    criteria: string[];
    model: string;
    answers: Record<string, unknown>;
    usage: unknown;
    dropped: string[];
    kept: string[];
  };
}

export interface DecisionRecord {
  type: string;
  instructions: string | null;
  model: string;
  answer: unknown;
  usage: { input_tokens: number | null; output_tokens: number | null } | null;
  usage_note?: string;
  requested_at: string | null;
}

export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord | null;
  redo_of: number | null;
}

export interface QueryAttempt {
  query: string;
  attempt: string | number;
  raw_results: number;
  kept: number;
  error?: string;
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
}
