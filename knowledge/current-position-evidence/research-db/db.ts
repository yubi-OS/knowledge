// research-db type map for knowledge/current-position-evidence
//
// File -> interface mapping:
//   preflight.json  -> PreflightRecord
//   outline.json    -> OutlineRecord
//   archive.json    -> DugResult[] (one entry per collected search result)
//   digs/*.json     -> DigRecord (one per subtopic dig)
//   jev-log.json    -> JevLogEntry[] (one entry per jev HTTP request)

// preflight.json
export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: number;
    unresponsive_engines: unknown[];
  };
  decide: {
    url: string;
    model: string;
    probe_answer: string | null;
  };
}

// outline.json
export interface OutlineRecord {
  topic: string;
  subtopics: Array<{
    nn: string;
    slug: string;
    scope: string;
    seed_queries: string[];
  }>;
  validation: {
    metric: string;
    criteria: string[];
    model: string;
    answers: Record<string, {
      score: number | null;
      probabilities: unknown;
      confidence: unknown;
      legend: unknown;
    }>;
    usage: unknown;
    dropped: string[];
    kept: string[];
  };
}

// One collected search result, weighted by the jev decision model (archive.json entry)
export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  nn: string;
  slug: string;
  weight: number | null;
  decision: DecisionRecord | null;
  redo_of: number | null;
}

// The full decision-model record attached to a DugResult
export interface DecisionRecord {
  type: string;
  instructions: string;
  model: string;
  answer: unknown;
  usage: { input_tokens?: number; output_tokens?: number } | null;
  requested_at: string;
}

// digs/<NN>-<slug>.json
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
  redo_log: Array<{
    attempt: number;
    reason: string;
    new_queries: string[];
  }>;
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

// jev-log.json entry
export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens?: number; output_tokens?: number };
}
