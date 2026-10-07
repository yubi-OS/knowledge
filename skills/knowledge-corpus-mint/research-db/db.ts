// Research DB schema v2 - file -> interface map
// preflight.json        -> PreflightRecord
// outline.json          -> OutlineRecord
// archive.json          -> DugResult[] (each with a DecisionRecord)
// digs/<NN>-<slug>.json -> DigRecord
// jev-log.json          -> JevLogEntry[]

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string; unresponsive_engines: string };
  decide: { url: string; model: string; note?: string; probe_answer?: unknown };
}

export interface OutlineSubtopic {
  nn: number;
  slug: string;
  scope: string;
  seed_queries: string[];
  internal?: boolean;
}

export interface OutlineRecord {
  topic: string;
  source_doc: string;
  subtopics: OutlineSubtopic[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, { score: number; probabilities: Record<string, number>; confidence: number; legend: Record<string, string> }>;
    usage: { input_tokens?: number; output_tokens?: number; cost?: number };
  };
  dropped: number[];
  kept: number[];
}

export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  answer: { type: string; noul?: number; score?: number; probabilities?: Record<string, number>; confidence?: number; legend?: Record<string, string> };
  usage: { input_tokens?: number; output_tokens?: number; cost?: number };
  requested_at: string;
}

export interface DugResult {
  nn: number;
  slug: string;
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord;
  redo_of: number | null;
}

export interface DigRecord {
  nn: number;
  slug: string;
  scope: string;
  queries_attempted: { query: string; attempt: number; raw_results: number; kept: number }[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
  note?: string;
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
}
