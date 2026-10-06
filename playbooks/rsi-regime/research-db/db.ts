// research-db/db.ts - TypeScript interfaces for the rsi-regime research-db (schema v2).
// File mapping: preflight.json -> PreflightRecord; outline.json -> OutlineRecord;
// archive.json -> DugResult[]; digs/<NN>-<slug>.json -> DigRecord;
// jev-log.json -> JevLogEntry[] (under {entries}).

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string; unresponsive_engines?: string[] };
  decide: { url: string; model: string; note: string };
}

export interface OutlineSubtopic {
  nn: string; slug: string; scope: string; seed_queries: string[]; dig: string;
}

export interface OutlineRecord {
  topic: string;
  subtopics: OutlineSubtopic[];
  validation: {
    metric: string; endpoint: string; criteria: string[]; model: string;
    answers: Record<string, { type: string; score: number; legend: Record<string, string>; probabilities: Record<string, number>; confidence: number }>;
    usage: { input_tokens: number; output_tokens: number; cost?: number };
    dropped: string[]; kept: string[];
  };
}

export interface DecisionRecord {
  type: string;
  instructions: string;
  model: string;
  answer: Record<string, unknown>;
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string;
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
  nn: string;
}

export interface DigQueryAttempt {
  query: string; attempt: number; raw_results: number; kept: number; error?: string;
}

export interface DigRecord {
  nn: string; slug: string; scope: string;
  queries_attempted: DigQueryAttempt[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries?: string[] }[];
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
  usage: { input_tokens: number; output_tokens: number; cost?: number };
  answer_raw?: Record<string, unknown>;
}
