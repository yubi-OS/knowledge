// research-db schema v2 for skills/runtime-attestation-keylime
// File -> interface mapping:
//   preflight.json        -> PreflightRecord
//   outline.json          -> OutlineRecord
//   archive.json          -> DugResult[]
//   digs/<NN>-<slug>.json -> DigRecord
//   jev-log.json          -> JevLogEntry[]

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string; unresponsive_engines?: unknown };
  decide: { url: string; model: string; probe_answer?: string; note?: string };
}

export interface OutlineRecord {
  topic: string;
  ground_source: string;
  subtopics: Array<{
    nn: number;
    slug: string;
    scope: string;
    dig?: boolean;
    seed_queries: string[];
  }>;
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
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
  answer: unknown;
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
  nn: number;
  slug: string;
}

export interface DigRecord {
  nn: number;
  slug: string;
  scope: string;
  queries_attempted: Array<{
    query: string;
    attempt: number;
    raw_results: number;
    kept: Array<{ title: string; url: string; snippet: string }>;
    http: number;
    elapsed_s: number;
    unresponsive_engines?: unknown;
  }>;
  redo_count: number;
  redo_log: Array<{ attempt: number; reason: string; new_queries: string[] }>;
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
  internal_record?: boolean;
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
