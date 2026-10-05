// research-db type map for knowledge/edgeless-reproducible-mkosi-research
// File -> interface mapping:
//   preflight.json                 -> PreflightRecord
//   outline.json                   -> OutlineRecord
//   archive.json                   -> DugResult[] (one entry per collected search result)
//   digs/<NN>-<slug>.json          -> DigRecord
//   jev-log.json                   -> JevLogEntry[] (one entry per /api/decide HTTP request)

/** preflight.json - endpoint health probe results taken before the mint. */
export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: number;
    unresponsive_engines: string[];
  };
  decide: {
    url: string;
    model: string;
    probe_answer: object;
  };
}

/** One subtopic in outline.json. */
export interface Subtopic {
  nn: number;
  slug: string;
  scope: string;
  seed_queries: string[];
}

/** Raw answer object returned by the clef score metric. */
export interface ScoreAnswer {
  type: "score";
  score: number;
  probabilities: Record<string, number>;
  confidence: number;
  legend: Record<string, string>;
}

/** outline.json - the decomposition and its jev score validation. */
export interface OutlineRecord {
  topic: string;
  subtopics: Subtopic[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, ScoreAnswer>;
    usage: { input_tokens: number; output_tokens: number };
    requested_at: string;
    dropped: number[];
    kept: number[];
    note?: string;
  };
}

/** The decision-model record attached to every weighted result. */
export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: string;
  answer: object;
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string;
}

/** archive.json entry - one collected search result with its jev weight. */
export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord;
  redo_of: number | null;
  nn?: number;
}

/** digs/<NN>-<slug>.json - the dig record for one subtopic. */
export interface DigRecord {
  nn: number;
  slug: string;
  scope: string;
  queries_attempted: {
    query: string;
    attempt: number;
    raw_results: number;
    kept: number;
  }[];
  redo_count: number;
  redo_log: {
    attempt: string;
    reason: string;
    new_queries: string[];
  }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
  weights_high?: number;
  weights_low?: number;
}

/** jev-log.json entry - one /api/decide HTTP request. */
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
