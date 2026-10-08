// research-db schema v2 for skills/shell-bridge-connection
// File -> interface mapping:
//   preflight.json            -> PreflightRecord
//   outline.json              -> OutlineRecord
//   archive.json              -> DugResult[] (one entry per collected search result)
//   digs/<NN>-<slug>.json     -> DigRecord
//   jev-log.json              -> JevLogEntry[] (one entry per jev HTTP request)

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string; unresponsive_engines: string[] };
  decide: { url: string; model: string; probe_answer: string };
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
  ground_source_url: string;
  subtopics: OutlineSubtopic[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, { type: string; score: number; legend: Record<string, string>; probabilities: Record<string, number>; confidence: number }>;
    usage: { input_tokens: number; output_tokens: number; cost?: number };
    dropped: string[];
    kept: string[];
    dropped_detail?: Array<{ nn: string; slug: string; score: number; reason: string }>;
  };
}

export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: "clef";
  answer: object;
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
}

export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: DigQueryAttempt[];
  redo_count: number;
  redo_log: Array<{ attempt: number; reason: string; new_queries: string[] }>;
  results_kept: string[];
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
  usage: { input_tokens: number | null; output_tokens: number | null };
  purpose?: string;
}
