// research-db type map for skills/curve-guided-rsi-self
// preflight.json -> PreflightRecord[]
// outline.json -> OutlineRecord
// archive.json -> DugResult[]
// digs/NN-<slug>.json -> DigRecord
// jev-log.json -> JevLogEntry[]
export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string; unresponsive_engines: string[] };
  decide: { url: string; model: string; note: string };
}
export interface ScoreAnswer { score: number; probabilities: Record<string, number>; confidence: number; legend: Record<string, string>; }
export interface OutlineRecord {
  topic: string;
  subtopics: { nn: string; slug: string; scope: string; queries: string[] }[];
  validation: {
    metric: string; criteria: string[]; model: string;
    answers: Record<string, ScoreAnswer>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[]; kept: string[];
  };
}
export interface DecisionRecord {
  type: string; instructions: string; model: string; answer: unknown;
  usage: { input_tokens: number; output_tokens: number }; requested_at: string;
}
export interface DugResult {
  query: string; title: string; url: string; snippet: string; collected_at: string;
  weight: number | null; decision: DecisionRecord; redo_of: number | null;
}
export interface DigRecord {
  nn: string; slug: string; scope: string;
  queries_attempted: { query: string; attempt: number; raw_results: number; kept?: number; note?: string }[];
  redo_count: number; redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[]; outcome: "authored" | "skipped"; skip_reason?: string;
  internal_record?: boolean; internal_record_note?: string;
}
export interface JevLogEntry {
  requested_at: string; endpoint: string; state: string; model: string;
  n_questions: number; question_names: string[]; metric_types: string[];
  usage: { input_tokens: number; output_tokens: number }; note?: string;
}
