// research-db interface map:
//   preflight.json            -> PreflightRecord
//   outline.json              -> OutlineRecord (SubtopicRecord, OutlineValidation)
//   archive.json (ARRAY of)   -> DugResult (with DecisionRecord)
//   digs/<NN>-<slug>.json     -> DigRecord (QueryAttempt, RedoLogEntry)
//   jev-log.json (ARRAY of)   -> JevLogEntry

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string };
  decide: { url: string; model: string; note?: string; probe_answer?: unknown };
}

export interface SubtopicRecord {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
}

export interface OutlineValidation {
  metric: string;
  criteria: string[];
  model: string;
  endpoint: string;
  answers: Record<string, { score_raw: number; score: number; probabilities?: Record<string, number>; confidence?: number; legend?: Record<string, string> }>;
  usage: { input_tokens?: number; output_tokens?: number; cost?: number };
  dropped: string[];
  kept: string[];
  dropped_detail?: Record<string, string>;
  note?: string;
}

export interface OutlineRecord {
  topic: string;
  ground_source: string;
  subtopics: SubtopicRecord[];
  validation: OutlineValidation;
}

export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  answer: unknown;
  usage: { input_tokens?: number; output_tokens?: number } | null;
  requested_at: string | null;
}

export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  subtopic_nn: string;
  decision: DecisionRecord;
  redo_of: number | null;
}

export interface QueryAttempt {
  query: string;
  attempt: number;
  raw_results: number;
  kept: number;
  error?: string;
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

export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens?: number; output_tokens?: number; cost?: number };
  http_status?: number;
}
