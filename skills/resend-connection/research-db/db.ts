// research-db interfaces for the resend-connection knowledge corpus (schema v2).
// File -> interface mapping:
//   research-db/preflight.json          -> PreflightRecord
//   research-db/outline.json            -> OutlineRecord
//   research-db/archive.json            -> DugResult[] (one entry per collected result)
//   research-db/digs/<NN>-<slug>.json   -> DigRecord
//   research-db/jev-log.json            -> JevLogEntry[]
//
// Note: weighting ran through DefAPI direct (https://api.defapi.org/api/v1/decisions,
// model typesafe/jev-1.13-20260917) per the skills-variant speed optimizations, so
// DecisionRecord.model carries the actual returned model string, and DugResult.weight
// equals the noul probability from the raw answer object.

export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  answer: Record<string, unknown>;
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
  decision: DecisionRecord;
  redo_of: number | null;
}

export interface SeedQuery {
  query: string;
  attempt: number;
  raw_results: number;
  kept: number;
}

export interface DigRecord {
  nn: number;
  slug: string;
  scope: string;
  queries_attempted: SeedQuery[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
  note?: string;
}

export interface SubtopicRecord {
  nn: number;
  slug: string;
  scope: string;
  seed_queries: string[];
  dig?: string;
}

export interface OutlineRecord {
  topic: string;
  ground_source?: string;
  subtopics: SubtopicRecord[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, { score: number; probabilities: Record<string, number>; confidence: number; legend: Record<string, string> }>;
    usage: { input_tokens: number; output_tokens: number };
    requested_at: string;
    endpoint: string;
    dropped: number[];
    kept: number[];
    notes?: string;
  };
}

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string };
  decide: { url: string; model: string; note: string };
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
