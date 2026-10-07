// db.ts - interfaces for the research-db files of skills/nss-failure-modes
// File -> interface map:
//   research-db/preflight.json -> PreflightRecord
//   research-db/outline.json   -> OutlineRecord
//   research-db/archive.json   -> DugResult[]
//   research-db/digs/*.json    -> DigRecord
//   research-db/jev-log.json   -> JevLogEntry[]

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string; unresponsive_engines: string[] };
  decide: { url: string; model: string; note?: string; probe_answer?: unknown };
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
  ground_source: { path: string; url: string; bytes: number; fetched_at: string };
  subtopics: OutlineSubtopic[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    endpoint: string;
    answers: Record<string, { score: number; probabilities: Record<string, number>; confidence: number; legend: Record<string, string> }>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: number[];
    kept: number[];
    note?: string;
  };
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

export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  answer: unknown; // raw answer object, e.g. { type: "noul", noul: 0.83 }
  usage: { input_tokens: number | null; output_tokens: number | null };
  requested_at: string;
}

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

export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens: number | null; output_tokens: number | null };
}
