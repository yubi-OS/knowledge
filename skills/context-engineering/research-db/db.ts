// research-db type map: file -> interface
// preflight.json        -> PreflightRecord
// outline.json          -> OutlineRecord
// archive.json          -> DugResult[] (one entry per collected search result)
// digs/<NN>-<slug>.json -> DigRecord
// jev-log.json          -> JevLogEntry[] (one entry per jev HTTP request)

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string; unresponsive_engines: string[] };
  decide: { url: string; model: string; note?: string; probe_answer?: string };
}

export interface ScoreAnswer {
  type: "score";
  score: number;
  legend: Record<string, string>;
  probabilities: Record<string, number>;
  confidence: number;
}

export interface OutlineRecord {
  topic: string;
  ground_source: string;
  subtopics: Array<{
    nn: string;
    slug: string;
    scope: string;
    seed_queries: string[];
  }>;
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    endpoint: string;
    answers: Record<string, ScoreAnswer>;
    usage: { input_tokens: number; output_tokens: number; cost?: number };
    dropped: string[];
    kept: string[];
  };
}

export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: string;
  answer: Record<string, unknown>;
  usage: { input_tokens: number | null; output_tokens: number | null };
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

export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: Array<{
    query: string;
    attempt: number;
    raw_results: number;
    kept: number;
  }>;
  redo_count: number;
  redo_log: Array<{ attempt: number; reason: string; new_queries: string }>;
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
  provider?: string;
  attempt?: number;
}
