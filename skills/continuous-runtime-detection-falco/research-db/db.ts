// research-db file -> interface map
// preflight.json   -> PreflightRecord
// outline.json     -> OutlineRecord
// archive.json     -> DugResult[] (one entry per collected result, including redo entries)
// digs/*.json      -> DigRecord
// jev-log.json     -> JevLogEntry[]
export interface DecisionRecord {
  type: string;
  instructions: string;
  model: string;
  answer: Record<string, unknown>;
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
export interface QueryAttempt { query: string; attempt: number; raw_results: number; kept: number; }
export interface RedoLogEntry { attempt: number; reason: string; new_queries: string[]; }
export interface DigRecord {
  nn: number;
  slug: string;
  scope: string;
  queries_attempted: QueryAttempt[];
  redo_count: number;
  redo_log: RedoLogEntry[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}
export interface Subtopic { nn: number; slug: string; scope: string; seed_queries: string[]; internal_record?: boolean; }
export interface OutlineRecord {
  topic: string;
  ground_source: string;
  subtopics: Subtopic[];
  validation: {
    metric: string;
    criteria: string[];
    model: string;
    endpoint: string;
    redo_note: string;
    redo_of_request: number;
    answers: Record<string, { score: number; probabilities: Record<string, number>; confidence: number; legend: Record<string, string>; }>;
    usage: Record<string, unknown>;
  };
  dropped: number[];
  kept: number[];
  first_pass_answers: Record<string, number>;
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
  label?: string;
  attempt?: number;
}
export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string; unresponsive_engines?: unknown };
  decide: { url: string; model: string; probe_answer?: unknown; note?: string };
}
