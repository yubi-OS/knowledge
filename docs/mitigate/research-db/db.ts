// research-db schema v2 for docs/mitigate (yubiOS docs/MITIGATE.md corpus)
// File mapping:
//   preflight.json -> PreflightRecord
//   outline.json   -> OutlineRecord
//   archive.json   -> DugResult[]
//   digs/<nn>-<slug>.json -> DigRecord
//   jev-log.json   -> JevLogEntry[]

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string };
  decide: { url: string; model: string; note: string };
}

export interface OutlineSubtopic {
  nn: string;              // original outline number 01..09
  final_nn: string | null; // shipped doc number, null when dropped
  slug: string;
  scope: string;
  seed_queries: string[];
  internal_record?: boolean;
}

export interface ScoreAnswer {
  type: "score";
  score: number;
  confidence: number;
  legend: Record<string, string>;
  probabilities: Record<string, number>;
}

export interface OutlineRecord {
  topic: string;
  ground_source: { path: string; url: string; bytes: number; fetched_at: string };
  subtopics: OutlineSubtopic[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    endpoint: string;
    answers: Record<string, ScoreAnswer>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[];
    kept: string[];
    drop_note: string;
  };
}

export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: string;
  answer: Record<string, unknown>; // raw answer object incl. noul probability
  usage: { input_tokens: number | null; output_tokens: number | null };
  requested_at: string;
}

export interface DugResult {
  query: string;
  nn: string;              // final doc number the result backs
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;   // jev noul probability; null only pre-weighting
  decision: DecisionRecord | null;
  redo_of: number | null;
}

export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: { query: string; attempt: number; raw_results: number; kept: number; error?: string; redo?: boolean }[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: { url: string; weight: number }[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
  internal_record?: boolean;
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
  usage: { input_tokens: number | null; output_tokens: number | null };
  note?: string;
}
