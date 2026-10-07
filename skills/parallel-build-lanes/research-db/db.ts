// research-db schema v2 - file -> interface map
// preflight.json -> PreflightRecord
// outline.json -> OutlineRecord
// archive.json -> DugResult[] (one entry per collected search result)
// digs/<NN>-<slug>.json -> DigRecord (one per corpus doc)
// jev-log.json -> JevLogEntry[] (one per jev HTTP request)

export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  answer: unknown; // raw answer object from the decision model
  usage: { input_tokens: number | null; output_tokens: number | null };
  requested_at: string | null;
}

export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null; // noul probability; non-null after weighting
  decision: DecisionRecord;
  redo_of: number | null;
  subtopic_nn: string;
}

export interface QueryAttempt {
  query: string;
  attempt: number;
  raw_results: number;
  kept: number;
}

export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: QueryAttempt[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
  note?: string; // present for internal-record subtopics (no dig)
}

export interface OutlineSubtopic {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
  internal_record: boolean;
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
    usage: unknown;
    dropped: string[];
    kept: string[];
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
  usage: unknown;
}

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string; unresponsive_engines: string[] };
  decide: { url: string; model: string; note: string };
}
