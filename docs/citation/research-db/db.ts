// yubi-OS/knowledge docs/citation research-db schema v2
// File -> interface map:
//   preflight.json              -> PreflightRecord
//   outline.json                -> OutlineRecord
//   archive.json (JSON array)   -> DugResult[]
//   digs/<NN>-<slug>.json       -> DigRecord
//   jev-log.json (JSON array)   -> JevLogEntry[]

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string; unresponsive_engines: string[] };
  decide: { url: string; model: string; note: string };
}

export interface OutlineSubtopic {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
  source_tNN?: string;
  dig_mode?: string;
}

export interface OutlineRecord {
  topic: string;
  ground_source: string;
  subtopics: OutlineSubtopic[];
  dropped: Array<{ tNN: string; slug: string; score: number; reason: string }>;
  validation: {
    metric: 'score';
    criteria: string[];
    model: string;
    answers: Record<string, { score: number; probabilities: Record<string, number>; confidence: number; legend: Record<string, string>; decoded?: number }>;
    usage: { input_tokens: number; output_tokens: number; cost?: number };
    decision_rule: string;
    dropped: string[];
    kept: string[];
  };
}

export interface DecisionRecord {
  type: string;
  instructions: string;
  model: string;
  answer: object; // raw answer object returned by the decision model, e.g. { type: "noul", noul: 0.95 }
  usage: { input_tokens: number; output_tokens: number } | null;
  requested_at: string;
}

export interface DugResult {
  nn: string;
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
  nn: string;
  slug: string;
  scope: string;
  internal_record?: boolean;
  queries_attempted: Array<{ query: string; attempt: number; raw_results: number; kept: Array<{ title: string; url: string; content: string }> }>;
  redo_count: number;
  redo_log: Array<{ attempt: number; reason: string; new_queries: string[] }>;
  results_kept: string[];
  outcome: 'authored' | 'skipped';
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
  usage: { input_tokens: number; output_tokens: number; cost?: number } | null;
  attempt?: number;
  note?: string;
}
