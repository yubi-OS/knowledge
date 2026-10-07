// Research DB interfaces for the skills/av-composer corpus (schema v2, skills variant)
export interface Preflight {
  date: string;
  searxng: { url: string; probe_results: string };
  decide: { url: string; model: string; note: string };
}
export interface OutlineSubtopic {
  nn: number; slug: string; scope: string; seed_queries: string[];
  score: number; verdict: "kept" | "dropped"; dig: string;
}
export interface Outline {
  topic: string; ground_source: string; variant: string; date: string;
  subtopics: OutlineSubtopic[];
  score_validation: { metric: "score"; criteria: string[]; endpoint: string; model: string;
    answers_in_full: Record<string, unknown>; kept: string[]; dropped: string[] };
}
export interface ArchiveEntry {
  query: string; title: string; url: string; snippet: string; collected_at: string;
  weight: number | null;
  decision: { type: "noul" | "score" | "choice"; instructions: string; model: string;
    answer: unknown; usage: { input_tokens: number; output_tokens: number; cost: number } | null;
    requested_at: string; endpoint: string };
  redo_of: string | null;
}
export interface DigRecord {
  nn: number; slug: string; scope: string;
  queries_attempted: { query: string; attempt: number; raw_results: number; kept: unknown[] }[];
  redo_count: number; redo_log: unknown[]; results_kept: number;
  outcome: "authored" | "skipped"; skip_reason?: string;
}
export interface JevLogEntry {
  timestamp: string; endpoint: string; state: string; model: string;
  n_questions: number; question_names: string[]; metric_types: string[];
  usage: { input_tokens: number; output_tokens: number; cost: number };
}
