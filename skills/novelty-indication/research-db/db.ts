// research-db schema v2 type definitions for skills/novelty-indication
// File mapping: preflight.json -> PreflightRecord; outline.json -> OutlineRecord;
// archive.json -> DugResult[]; digs/<NN>-<slug>.json -> DigRecord;
// jev-log.json -> JevLogEntry[]

export interface Usage {
  input_tokens: number | null;
  output_tokens: number | null;
}

// archive.json: one entry per collected search result (array)
export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null; // noul probability; null only if unscored (never in a shipped mint)
  decision: DecisionRecord;
  redo_of: number | null;
}

// embedded in DugResult.decision and OutlineRecord validation answers
export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: "clef";
  answer: unknown; // raw answer object, e.g. { type: "noul", noul: 0.93 }
  usage: Usage | null;
  requested_at: string;
}

// outline.json
export interface OutlineRecord {
  topic: string;
  subtopics: { nn: number; slug: string; scope: string; seed_queries: string[] }[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    endpoint: string;
    answers: Record<string, unknown>; // raw score answers incl. probabilities, confidence, legend
    usage: unknown;
  };
}

// digs/<NN>-<slug>.json
export interface DigRecord {
  nn: number;
  slug: string;
  scope: string;
  queries_attempted: { query: string; attempt: number; raw_results: number; kept: number }[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
  note?: string;
}

// jev-log.json: one entry per jev HTTP request (array)
export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: Usage | null;
}

// preflight.json
export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string; unresponsive_engines: string[] };
  decide: { url: string; model: string; note: string };
}
