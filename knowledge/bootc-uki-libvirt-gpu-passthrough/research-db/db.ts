// research-db schema v2 - yubi-OS knowledge corpus bootc-uki-libvirt-gpu-passthrough
// File -> interface mapping:
//   research-db/archive.json    -> DugResult[] (top-level JSON array)
//   research-db/outline.json   -> OutlineRecord
//   research-db/preflight.json -> PreflightRecord
//   research-db/jev-log.json   -> JevLogEntry[] (top-level JSON array)
//   research-db/digs/*.json    -> DigRecord (one per doc)

export interface DecisionRecord {
  type: 'noul' | 'score' | 'choice';
  instructions: string;
  model: string;
  answer: Record<string, unknown> | null;
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string;
}

export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord | null;
  redo_of: number | null;
}

export interface SeedQuery { query: string; attempt: number; raw_results: number; kept: number; }

export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: SeedQuery[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: 'authored' | 'skipped';
  skip_reason?: string;
}

export interface OutlineRecord {
  topic: string;
  subtopics: { nn: string; slug: string; scope: string; seed_queries: string[] }[];
  validation: {
    metric: 'score';
    criteria: string[];
    model: string;
    answers: Record<string, { score: number; probabilities?: Record<string, number>; confidence?: number; legend?: Record<string, string> }>;
    usage: { input_tokens: number; output_tokens: number } | null;
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
  usage: { input_tokens: number; output_tokens: number };
}

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: number; unresponsive_engines: unknown[] };
  decide: { url: string; model: string; probe_answer: Record<string, unknown> | null };
}
