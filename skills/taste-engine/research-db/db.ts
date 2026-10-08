// research-db schema v2 for skills/taste-engine (yubi-OS/knowledge)
// File -> interface map:
//   research-db/preflight.json -> PreflightRecord
//   research-db/outline.json   -> OutlineRecord
//   research-db/archive.json   -> DugResult[]  (JSON array)
//   research-db/digs/*.json    -> DigRecord
//   research-db/jev-log.json   -> JevLogEntry[] (JSON array)

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string; unresponsive_engines: string[] };
  decide: { url: string; model: string; probe_answer: string; note?: string };
}

export interface DugResult {
  query: string;
  nn: string;
  slug: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord;
  redo_of: number | null;
}

export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: "clef";
  answer: { type: string; noul?: number; score?: number; probabilities?: Record<string, number>; confidence?: number; legend?: Record<string, string> } | null;
  usage: { input_tokens: number | null; output_tokens: number | null };
  requested_at: string;
}

export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: { query: string; attempt: number; raw_results: number; kept: number }[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

export interface OutlineRecord {
  topic: string;
  ground_source: string;
  subtopics: { nn: string; slug: string; scope: string; seed_queries: string[]; score: number; probabilities: Record<string, number> }[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    endpoint: string;
    answers: Record<string, { score: number; probabilities: Record<string, number>; confidence: number; legend: Record<string, string> }>;
    revalidation: { reason: string; answers: Record<string, { score: number; probabilities: Record<string, number>; confidence: number; legend: Record<string, string> }> };
    usage: { input_tokens: number | null; output_tokens: number | null };
    dropped: string[];
    kept: string[];
  };
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
  note?: string;
}
