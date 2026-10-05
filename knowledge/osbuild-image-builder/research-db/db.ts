// research-db type definitions for knowledge/osbuild-image-builder
// File mapping:
//   research-db/preflight.json      -> PreflightRecord
//   research-db/outline.json        -> OutlineRecord
//   research-db/archive.json        -> DugResult[] (JSON array, one entry per collected result)
//   research-db/digs/<NN>-<slug>.json -> DigRecord (one file per subtopic)
//   research-db/jev-log.json        -> JevLogEntry[] (JSON array, one entry per jev HTTP request)

/** research-db/preflight.json */
export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: {
      query?: string;
      status: string;
      result_count?: number;
      engines_seen?: string[];
      error?: string;
    };
    unresponsive_engines: string[];
  };
  decide: {
    url: string;
    model: string;
    probe_answer: string;
  };
}

/** research-db/outline.json */
export interface OutlineRecord {
  topic: string;
  subtopics: {
    nn: string;
    slug: string;
    scope: string;
    seed_queries: string[];
  }[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, {
      score: number | null;
      probabilities: Record<string, number> | null;
      confidence: number | null;
      legend: Record<string, string> | null;
    }>;
    usage: { input_tokens?: number; output_tokens?: number };
    dropped: string[];
    kept: string[];
  };
}

/** one entry of research-db/archive.json */
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

/** embedded decision record on every DugResult */
export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: string;
  answer: Record<string, unknown>;
  usage: { input_tokens?: number; output_tokens?: number };
  requested_at: string;
}

/** research-db/digs/<NN>-<slug>.json */
export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: {
    query: string;
    attempt: number;
    raw_results: number;
    kept: number;
    error?: string;
  }[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

/** one entry of research-db/jev-log.json */
export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string | null;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens?: number; output_tokens?: number };
}
