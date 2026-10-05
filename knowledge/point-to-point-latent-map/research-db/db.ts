// db.ts - TypeScript interfaces for the research-db of knowledge/point-to-point-latent-map
// preflight.json -> PreflightRecord
export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: Record<string, number | string>; unresponsive_engines: string[] };
  decide: { url: string; model: string; probe_answer: Record<string, unknown>; usage: { input_tokens: number; output_tokens: number } | null };
}

// outline.json -> OutlineRecord
export interface OutlineSubtopic { nn: string; slug: string; scope: string; seed_queries: string[] }
export interface OutlineRecord {
  topic: string;
  subtopics: OutlineSubtopic[];
  validation: {
    metric: string;
    criteria: string[];
    model: string;
    answers: Record<string, { type: string; score: number; legend: Record<string, string>; probabilities: Record<string, number>; confidence: number }>;
    usage: { input_tokens: number; output_tokens: number } | null;
    http_status: number;
    requested_at: string;
    kept: string[];
    dropped: string[];
  };
}

// archive.json (JSON array) -> DugResult
export interface DecisionRecord {
  type: string;
  instructions: string;
  model: string;
  answer: Record<string, unknown>;
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
  decision: DecisionRecord | null;
  redo_of: number | null;
}

// digs/<NN>-<slug>.json -> DigRecord
export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: { query: string; attempt: number; raw_results: number; kept: number }[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: 'authored' | 'skipped';
  skip_reason?: string;
}

// jev-log.json (JSON array) -> JevLogEntry
export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens: number; output_tokens: number } | null;
  http_status?: number;
  attempt?: number;
  outcome?: string;
}
