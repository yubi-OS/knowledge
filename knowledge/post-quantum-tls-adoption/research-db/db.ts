// research-db/db.ts — interfaces for the research-db files in this corpus.
// File mapping:
//   preflight.json        -> PreflightRecord
//   outline.json          -> OutlineRecord
//   archive.json          -> DugResult[] (a JSON array of DugResult)
//   digs/<NN>-<slug>.json -> DigRecord (one per subtopic)
//   jev-log.json          -> JevLogEntry[] (a JSON array of JevLogEntry)

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string; unresponsive_engines: string[] };
  decide: { url: string; model: string; probe_answer: Record<string, unknown> };
}

export interface OutlineSubtopic {
  nn: number;
  slug: string;
  scope: string;
  seed_queries: string[];
  score?: number;
}

export interface OutlineValidationAnswer {
  score: number;
  probabilities: Record<string, number>;
  confidence: number;
  legend: Record<string, string>;
}

export interface OutlineRecord {
  topic: string;
  subtopics: OutlineSubtopic[];
  validation: {
    metric: string;
    criteria: string[];
    model: string;
    answers: Record<string, OutlineValidationAnswer>;
    usage: JevUsage;
    dropped: number[];
    kept: number[];
    conditional?: { nn: number; slug: string; note: string }[];
  };
}

export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: string;
  answer: Record<string, unknown>;
  usage: JevUsage;
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
  nn: number;
  slug: string;
  scope: string;
  queries_attempted: DigQueryAttempt[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

export interface JevUsage {
  input_tokens: number;
  output_tokens: number;
}

export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model?: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: JevUsage;
}
