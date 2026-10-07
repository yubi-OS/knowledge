// research-db type map for skills/nss-adjacent-problems/
// File -> interface:
//   preflight.json -> PreflightRecord
//   outline.json   -> OutlineRecord
//   archive.json   -> DugResult[] (one entry per collected result)
//   digs/<NN>-<slug>.json -> DigRecord
//   jev-log.json   -> JevLogEntry[]

export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: string;
    unresponsive_engines?: string[];
  };
  decide: {
    url: string;
    model: string;
    probe_answer?: unknown;
    note?: string;
  };
}

export interface SubtopicSeed {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
}

export interface OutlineRecord {
  topic: string;
  subtopics: SubtopicSeed[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    endpoint?: string;
    answers: Record<string, unknown>;
    usage: unknown;
    dropped: string[];
    kept: string[];
  };
}

export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: string;
  answer: unknown;
  usage: unknown;
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
}

export interface DigQueryAttempt {
  query: string;
  attempt: number;
  status?: number;
  elapsed?: number;
  raw_results?: number;
  kept?: number;
}

export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: DigQueryAttempt[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens?: number; output_tokens?: number; cost?: number };
  http_status: number;
  note?: string;
}
