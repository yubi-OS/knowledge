// research-db type map for skills/linkedin-browser-outreach
// File -> interface mapping:
//   preflight.json -> PreflightRecord
//   outline.json   -> OutlineRecord
//   archive.json   -> DugResult[] (with DecisionRecord inside)
//   digs/*.json    -> DigRecord
//   jev-log.json   -> JevLogEntry[]

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string; unresponsive_engines: string[] };
  decide: { url: string; model: string; note?: string; probe_answer?: unknown };
}

export interface OutlineSubtopic {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
  internal_record?: boolean;
}

export interface OutlineRecord {
  topic: string;
  ground_source: string;
  subtopics: OutlineSubtopic[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    endpoint?: string;
    answer_id?: string;
    answers: Record<string, { score: number; probabilities: Record<string, number>; confidence: number }>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[];
    kept: string[];
  };
}

export interface DecisionRecord {
  type: "noul" | "score";
  instructions: string;
  model: "clef";
  answer: Record<string, unknown>;
  usage: { input_tokens: number; output_tokens: number } | null;
  requested_at: string;
}

export interface DugResult {
  query: string;
  nn: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord | null;
  redo_of: number | null;
}

export interface QueryAttempt {
  query: string;
  attempt: number;
  raw_results: number;
  kept: number;
}

export interface RedoLogEntry {
  attempt: number;
  reason: string;
  new_queries: string[];
}

export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: QueryAttempt[];
  redo_count: number;
  redo_log: RedoLogEntry[];
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
  usage: { input_tokens: number; output_tokens: number } | null;
  answer_id?: string | null;
}
