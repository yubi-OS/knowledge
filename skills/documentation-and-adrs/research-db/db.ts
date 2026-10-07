// research-db type map:
//   preflight.json  -> PreflightRecord
//   outline.json    -> OutlineRecord
//   archive.json    -> DugResult[] (one entry per collected search result)
//   jev-log.json    -> JevLogEntry[] (one entry per jev HTTP request)
//   digs/<NN>-<slug>.json -> DigRecord

export interface DecisionRecord {
  type: "score" | "noul" | "choice";
  instructions: string;
  model: "clef";
  answer: Record<string, unknown>;
  usage: { input_tokens?: number; output_tokens?: number; cost?: number };
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
  nn: string;
  slug: string;
}

export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: { query: string; attempt: number; raw_results: number; kept: number; redo?: boolean }[];
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
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, unknown>;
    dropped: string[];
    kept: string[];
  };
  jev_requests: number;
}

export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names?: string[];
  metric_types: string[];
  usage: { input_tokens?: number; output_tokens?: number; cost?: number };
}

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string };
  decide: { url: string; model: string; note: string };
}
