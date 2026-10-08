// research-db/db.ts - TypeScript interfaces for the repo-refs-skill research database.
// File -> interface mapping:
//   research-db/preflight.json -> PreflightRecord
//   research-db/outline.json   -> OutlineRecord
//   research-db/archive.json   -> DugResult[] (one entry per collected result)
//   research-db/jev-log.json   -> JevLogEntry[] (one entry per jev HTTP request)
//   research-db/digs/<NN>-<slug>.json -> DigRecord

export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  answer: object; // raw answer object as returned by the decision model
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string; // ISO 8601
  note?: string;
}

export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string; // ISO 8601
  weight: number | null; // noul probability; null = unweighted
  decision: DecisionRecord | null;
  redo_of: number | null; // index of the superseded entry when a result was rescored
}

export interface QueryAttempt {
  query: string;
  attempt: number;
  raw_results: number;
  kept: number;
  error?: string;
}

export interface DigRecord {
  nn: number;
  slug: string;
  scope: string;
  queries_attempted: QueryAttempt[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[]; // urls
  outcome: "authored" | "skipped";
  skip_reason?: string;
  note?: string; // e.g. "internal-record subtopic, no dig"
}

export interface OutlineSubtopic {
  nn: number;
  slug: string;
  scope: string;
  seed_queries: string[];
  note?: string;
}

export interface OutlineRecord {
  topic: string;
  source_doc: string;
  subtopics: OutlineSubtopic[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    endpoint: string;
    answers: Record<string, { score: number; probabilities: Record<string, number>; confidence: number }>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: number[];
    kept: number[];
    note?: string;
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
  note?: string;
}

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string; unresponsive_engines?: string[] };
  decide: { url: string; model: string; probe_answer?: string; note?: string };
}
