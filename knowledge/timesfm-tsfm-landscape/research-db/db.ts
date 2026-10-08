// research-db/db.ts - typed mirror of the research-db schema (v2)
// Corpus: knowledge/timesfm-tsfm-landscape (yubi-OS/knowledge)
// Minted: 2026-10-08

export const RESEARCH_DB_SCHEMA_VERSION = 2;

// preflight.json
export interface SearxngProbe {
  url: string;
  http_status: number;
  result_count: number;
  unresponsive_engines_count: number;
  has_suspended: boolean;
  ok: boolean;
}

export interface DecideProbe {
  url: string;
  http_status: number;
  has_answers: boolean;
  model: string;
  probe_noul: number;
  task_id: string | null;
  ok: boolean;
}

export interface Preflight {
  probed_at: string;
  searxng: SearxngProbe;
  decide: DecideProbe;
  post_preflight_note: string;
  gate_passed: boolean;
}

// outline.json
export interface Subtopic {
  nn: string; // "01".."07"
  slug: string;
  score: number; // probability-weighted score on the 0..2 scale
  verdict: "padding: drop" | "marginal: keep only if the dig comes back strong" | "load-bearing: core subtopic";
  scope: string;
}

export interface OutlineScoreBatch {
  requested_at: string;
  status: number;
  model: string;
  task_id: string;
  consumed: string | null;
  usage: { input_tokens: number; output_tokens: number } | null;
  answers: Record<string, AnswerScore>;
  legend: unknown;
}

export interface AnswerScore {
  type: "score";
  score: number;
  legend?: string[];
  probabilities?: Record<string, number>;
  confidence?: number;
}

export interface Outline {
  ref: string;
  topic: string;
  schema_version: number;
  created_at: string;
  subtopics: Subtopic[];
  outline_score_validation: {
    metric: "score";
    criteria: string[];
    drop_rule: string;
    endpoint: string;
    model_returned: string;
    batches: OutlineScoreBatch[];
    dropped: string[];
    kept: string[];
  };
}

// archive.json - one entry per collected search result
export interface AnswerNoul {
  type: "noul";
  noul: number; // probability of true, 0..1; weight = this value
}

export interface ArchiveDecision {
  type: "noul";
  instructions: string;
  endpoint: string; // https://steady-orbit.systems-a.workers.dev/api/decide | https://api.defapi.org/api/v1/decisions
  model: string; // "clef" | "typesafe/jev-1.13-20260917"
  answer: AnswerNoul | null;
  usage: { input_tokens: number; output_tokens: number; cost?: string } | null;
  requested_at: string;
  task_id: string | null;
}

export interface ArchiveEntry {
  id: string; // "<nn>-<slug>:q<query#>-r<result#>"
  nn: string;
  slug: string;
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null; // null only when the answer was missing (recorded as MISSING_ANSWER and redone)
  decision: ArchiveDecision;
  redo_of?: "attempt-1"; // present on attempt-2 (redo) results
}

// digs/<NN>-<slug>.json
export interface DigQueryAttempt {
  query: string;
  attempt: 1 | 2;
  raw_results: { title: string; url: string; snippet: string }[];
  kept: number;
  http_status?: number;
  error?: string;
}

export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: DigQueryAttempt[];
  redo_count: number;
  redo_log: { reason: string; at: string }[];
  results_kept: { url: string; title: string; weight: number; redo_of: string | null }[];
  high_weight_results: number;
  outcome: "authored" | "skipped";
  skip_reason?: string;
  jev_weights_summary: { total: number; high: number; max: number };
}

// jev-log.json - one entry per jev HTTP request
export interface JevLogEntry {
  timestamp: string;
  endpoint: string;
  model: string;
  task_id: string | null;
  consumed: string | null; // USD cost as string where the provider returns it
  usage: { input_tokens: number; output_tokens: number; cost?: string } | null;
  n_questions: number;
  question_names: string[];
  metric_types: ("noul" | "score" | "choice")[];
}
