// research-db type map for the code-simplification knowledge corpus mint (2026-10-06)
// File -> interface:
//   preflight.json                 -> PreflightRecord
//   outline.json                   -> OutlineRecord
//   archive.json                   -> DugResult[] (one entry per collected result)
//   digs/<NN>-<slug>.json          -> DigRecord
//   jev-log.json                   -> JevLogEntry[]
export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: string;
    unresponsive_engines: string[];
  };
  decide: {
    url: string;
    model: string;
    note?: string;
    used_endpoint?: string;
  };
}

export interface OutlineRecord {
  topic: string;
  ground_source: string;
  subtopics: Array<{
    nn: string;
    slug: string;
    scope: string;
    seed_queries: string[];
    redo_queries?: string[];
    internal_record?: boolean;
  }>;
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    endpoint: string;
    answers: Record<string, {
      score: number;
      probabilities: Record<string, number>;
      confidence: number;
      legend: Record<string, string>;
    }>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[];
    kept: string[];
  };
  dropped_reason?: Record<string, string>;
}

export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: string; // "clef"
  answer: unknown; // raw answer object from the decision model
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
  attempt: number;
  redo_of_attempt?: number;
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
  redo_log: Array<{ attempt: number; reason: string; new_queries: string[] }>;
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
  usage: { input_tokens: number | null; output_tokens: number | null };
}
