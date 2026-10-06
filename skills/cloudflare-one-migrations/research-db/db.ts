// research-db interface map for skills/cloudflare-one-migrations
// preflight.json     -> PreflightRecord
// outline.json       -> OutlineRecord
// archive.json       -> DugResult[] (JSON array)
// digs/<NN>-<slug>.json -> DigRecord (one file per subtopic)
// jev-log.json       -> JevLogEntry[] (JSON array)

export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  answer: Record<string, unknown>; // raw answer object incl. probabilities/legend/confidence
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string;
}

export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null; // noul probability; null only if unweighted (must not ship)
  decision: DecisionRecord;
  redo_of: number | null; // index of superseded unweighted entry
}

export interface DigRecord {
  nn: string;
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

export interface OutlineRecord {
  topic: string;
  subtopics: { nn: string; slug: string; scope: string; seed_queries: string[] }[];
  validation: {
    metric: string;
    criteria: string[];
    model: string;
    endpoint_used?: string;
    answers: Record<string, unknown>;
    usage: { input_tokens: number; output_tokens: number };
    decision_id?: string;
    rounding?: string;
    dropped: string[];
    kept: string[];
    notes?: string;
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
  searxng: { url: string; probe_results: string; unresponsive_engines?: string };
  decide: { url: string; model: string; probe_answer?: string; note?: string };
}
