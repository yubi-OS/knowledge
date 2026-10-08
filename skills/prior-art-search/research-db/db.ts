// db.ts — schema v2 interfaces for the skills/prior-art-search knowledge corpus research-db.
// File -> interface mapping:
//   research-db/preflight.json  -> PreflightRecord
//   research-db/outline.json    -> OutlineRecord
//   research-db/archive.json    -> DugResult[] (one entry per collected search result)
//   research-db/digs/<NN>-<slug>.json -> DigRecord
//   research-db/jev-log.json    -> JevLogEntry[] (one entry per jev HTTP request)

export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: string;
    unresponsive_engines: string[] | null;
  };
  decide: {
    url: string;
    model: string;
    probe_answer: string;
  };
}

export interface OutlineSubtopic {
  nn: number;
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
    metric: string;
    criteria: string[];
    model: string;
    endpoint: string;
    requested_at: string;
    answers: Record<string, unknown>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: number[];
    kept: number[];
  };
}

export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  answer: unknown; // raw answer object, e.g. { "type": "noul", "noul": 0.83 }
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
  nn: number; // subtopic this result was dug for
  slug: string;
}

export interface DigRecord {
  nn: number;
  slug: string;
  scope: string;
  queries_attempted: Array<{
    query: string | null;
    attempt: number;
    raw_results: number;
    kept: number;
    note?: string; // present for internal-record subtopics (no dig)
  }>;
  redo_count: number;
  redo_log: Array<{ attempt: number; reason: string; new_queries: string[] }>;
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string | null;
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
