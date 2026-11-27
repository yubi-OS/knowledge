// Typed Research DB Schema v2 for yubi-OS/knowledge/skills/risque/
// File mapping:
//   preflight.json -> PreflightRecord
//   outline.json   -> OutlineRecord
//   archive.json   -> ArchiveEntry[]
//   digs/*.json    -> DigRecord
//   jev-log.json   -> JevLogEntry[]

export interface PreflightRecord {
  date: string;
  verified_at: string;
  searxng: {
    url: string;
    ok: boolean;
    probe_query: string;
    probe_results: number;
    result_count: number;
    unresponsive_engines: unknown[];
  };
  decide: {
    url: string;
    ok: boolean;
    model: string;
    probe_answer: unknown;
    answer: unknown;
  };
}

export interface SubtopicOutlineItem {
  nn: string;
  slug: string;
  title: string;
  scope: string;
  seed_queries: string[];
  clef_score: number;
  clef_answer: unknown;
}

export interface OutlineRecord {
  ref: string;
  topic: string;
  created_at: string;
  model: string;
  subtopics: SubtopicOutlineItem[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, unknown>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[];
    kept: string[];
  };
  kept: string[];
  dropped: string[];
  raw_answers: Record<string, unknown>;
  usage: { input_tokens: number; output_tokens: number };
}

export interface ArchiveDecision {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  answer: unknown;
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string;
}

export interface ArchiveEntry {
  doc: string;
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number;
  decision: ArchiveDecision;
  redo_of: string | null;
}

export interface DigRecord {
  nn: string;
  slug: string;
  title: string;
  scope: string;
  queries_attempted: Array<{ query: string; attempt: number; raw_results: number; kept: number }>;
  redo_count: number;
  redo_log: unknown[];
  results_kept: string[];
  results_kept_count: number;
  high_weight_count: number;
  results: ArchiveEntry[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

export interface JevLogEntry {
  requested_at: string;
  timestamp: string;
  endpoint: string;
  state: string;
  label: string;
  attempt: number;
  duration_ms: number;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens: number; output_tokens: number };
}
