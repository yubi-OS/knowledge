// research-db schema (v2) for knowledge/decisions-deferrals-rejected-models
// File -> interface mapping:
//   research-db/preflight.json -> PreflightRecord
//   research-db/outline.json   -> OutlineRecord
//   research-db/archive.json   -> DugResult[]
//   research-db/digs/NN-slug.json -> DigRecord
//   research-db/jev-log.json   -> JevLogEntry[]

export interface DugResult {
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

export interface DecisionRecord {
  type: string; // 'noul' | 'score'
  instructions: string;
  model: string; // 'clef'
  answer: Record<string, unknown>; // raw answer object from /api/decide
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string;
}

export interface DigRecord {
  nn: number;
  slug: string;
  scope: string;
  queries_attempted: { query: string; attempt: number; raw_results: number; kept: number }[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: 'authored' | 'skipped';
  skip_reason?: string;
}

export interface OutlineRecord {
  topic: string;
  subtopics: { nn: number; slug: string; scope: string; seed_queries: string[] }[];
  validation: {
    metric: string; // 'score'
    criteria: string[];
    model: string;
    answers: Record<string, { score: number; probabilities: Record<string, number>; confidence: number; legend: Record<string, string> }>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: number[];
    kept: number[];
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
  usage: { input_tokens: number; output_tokens: number };
}

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: number; unresponsive_engines: string[] };
  decide: { url: string; model: string; probe_answer: number };
}
