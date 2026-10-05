// research-db TypeScript interfaces, one per research-db file.
// preflight.json -> PreflightRecord
export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: number; unresponsive_engines: unknown };
  decide: { url: string; model: string; probe_answer: unknown };
}
// outline.json -> OutlineRecord
export interface OutlineRecord {
  topic: string;
  subtopics: { nn: string; slug: string; scope: string; seed_queries: string[] }[];
  validation: {
    metric: string; criteria: string[]; model: string;
    answers: Record<string, unknown>; usage: { input_tokens: number; output_tokens: number };
    dropped: string[]; kept: string[];
  };
}
// archive.json -> DugResult[]
export interface DugResult {
  query: string; title: string; url: string; snippet: string; collected_at: string;
  weight: number | null;
  decision: DecisionRecord;
  redo_of: number | null;
}
// (inside DugResult) -> DecisionRecord
export interface DecisionRecord {
  type: string; instructions: string; model: string; answer: unknown;
  usage: { input_tokens: number; output_tokens: number }; requested_at: string;
}
// digs/<NN>-<slug>.json -> DigRecord
export interface DigRecord {
  nn: string; slug: string; scope: string;
  queries_attempted: { query: string; attempt: number; raw_results: number; kept: number }[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}
// jev-log.json -> JevLogEntry[]
export interface JevLogEntry {
  requested_at: string; endpoint: string; state: string; model: string;
  n_questions: number; question_names: string[]; metric_types: string[];
  usage: { input_tokens: number; output_tokens: number };
}
