// research-db type map (schema v2)
// preflight.json  -> PreflightRecord
// outline.json    -> OutlineRecord
// archive.json    -> DugResult[]
// digs/*.json     -> DigRecord
// jev-log.json    -> JevLogEntry[]

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string; unresponsive_engines?: unknown[] };
  decide: { url: string; model: string; note?: string; probe_answer?: unknown };
}

export interface OutlineSubtopic {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
}

export interface OutlineRecord {
  topic: string;
  ground_source: string;
  subtopics: OutlineSubtopic[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    endpoint: string;
    answers: Record<string, unknown>;
    usage: { input_tokens: number; output_tokens: number; cost?: number };
    dropped: string[];
    kept: string[];
    interpretation: string;
  };
}

export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  answer: unknown; // raw answer object (probabilities / legend / confidence)
  usage: { input_tokens: number | null; output_tokens: number | null };
  requested_at: string;
}

export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord;
  redo_of: number | null;
}

export interface DigQueryAttempt {
  query: string;
  attempt: number;
  raw_results: number;
  kept: number;
  error?: string;
  unresponsive_engines?: unknown;
}

export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: DigQueryAttempt[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: { title: string; url: string; snippet: string }[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens: number; output_tokens: number; cost?: number };
}
