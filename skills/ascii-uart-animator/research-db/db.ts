// research-db schema v2 for the skills/ascii-uart-animator corpus.
// File map: preflight.json -> PreflightRecord; outline.json -> OutlineRecord;
// archive.json -> DugResult[]; digs/*.json -> DigRecord; jev-log.json -> JevLogEntry[].

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string; unresponsive_engines: string[] };
  decide: { url: string; model: string; note?: string };
}

export interface OutlineSubtopic {
  nn: number; slug: string; scope: string; seed_queries: string[];
}
export interface OutlineRecord {
  topic: string; ground_source: string; subtopics: OutlineSubtopic[];
  validation: {
    metric: "score"; criteria: string[]; model: string; endpoint: string;
    answers: Record<string, { score: number; probabilities: Record<string, number>; confidence: number }>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: number[]; kept: number[]; note?: string;
  };
}

export interface DecisionRecord {
  type: "noul" | "score";
  instructions: string;
  model: string;
  answer: Record<string, unknown>;
  usage: { input_tokens: number; output_tokens: number } | null;
  requested_at: string;
}
export interface DugResult {
  query: string; title: string; url: string; snippet: string; collected_at: string;
  weight: number | null; decision: DecisionRecord; redo_of: number | null;
}

export interface DigRecord {
  nn: number; slug: string; scope: string;
  queries_attempted: { query: string; attempt: number; raw_results: number; kept: number }[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  note?: string;
  skip_reason?: string;
}

export interface JevLogEntry {
  requested_at: string; endpoint: string; state: string; model: string;
  n_questions: number; question_names: string[]; metric_types: string[];
  usage: { input_tokens: number; output_tokens: number };
}
