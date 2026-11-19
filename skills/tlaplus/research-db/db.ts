// Typed Research DB Schema v2 for yubi-OS/knowledge/knowledge/tlaplus/
export interface PreflightRecord {
  verified_at: string;
  searxng: { url: string; ok: boolean; probe_query: string; result_count: number; unresponsive_engines: string[] };
  decide: { url: string; ok: boolean; model: string; answer: unknown };
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
  kept: string[];
  dropped: string[];
  raw_answers: Record<string, unknown>;
  usage: Record<string, number>;
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
  doc?: string;
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
  results_kept: number;
  high_weight_count: number;
  results: ArchiveEntry[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

export interface JevLogEntry {
  timestamp: string;
  endpoint: string;
  label: string;
  attempt: number;
  duration_ms: number;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens: number; output_tokens: number };
}
