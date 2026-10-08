// research-db schema v2 for skills/radio-queue (yubi-OS/knowledge). File -> interface map:
// preflight.json -> PreflightRecord; outline.json -> OutlineRecord; archive.json -> DugResult[];
// digs/NN-slug.json -> DigRecord; jev-log.json -> JevLogEntry[].
export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string; unresponsive_engines?: string[] };
  decide: { url: string; model: string; probe_answer?: string; note?: string };
}
export interface OutlineSubtopic {
  nn: number; slug: string; scope: string; dig_mode: "web" | "internal";
  seed_queries: string[]; note?: string;
  score: number; padding_probability: number;
}
export interface OutlineRecord {
  topic: string; ground_source: string; subtopics: OutlineSubtopic[];
  validation: {
    metric: string; endpoint: string; model: string; criteria: string[]; state: string;
    answers: Record<string, unknown>; usage: Record<string, unknown>;
    dropped: Array<Record<string, unknown>>; kept: number[]; answer_keys?: Record<string, string>;
  };
}
export interface DecisionRecord {
  type: string; instructions: string; model: string;
  answer: Record<string, unknown>;
  usage: { input_tokens?: number; output_tokens?: number };
  requested_at: string; task_id?: string;
}
export interface DugResult {
  query: string; title: string; url: string; snippet: string; collected_at: string;
  weight: number | null; decision?: DecisionRecord; redo_of: null | number;
  nn?: number; slug?: string;
}
export interface DigRecord {
  nn: number; slug: string; scope: string;
  queries_attempted: Array<{ query: string; attempt: number; raw_results: number; kept: number }>;
  redo_count: number; redo_log: Array<{ attempt: number; reason: string; new_queries: string[] }>;
  results_kept: string[]; outcome: "authored" | "skipped"; skip_reason?: string; note?: string;
  results_weighted_high?: number; results_weighted_low?: number;
}
export interface JevLogEntry {
  requested_at: string; endpoint: string; state: string; model: string;
  n_questions: number; question_names: string[]; metric_types: string[];
  usage: { input_tokens?: number | null; output_tokens?: number | null; cost?: number | null };
  purpose?: string; batch?: number; outcome?: string;
}
