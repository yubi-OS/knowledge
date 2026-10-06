// research-db type map for knowledge/jev-automations-solo
//
// File -> interface mapping:
//   preflight.json        -> PreflightRecord
//   outline.json          -> OutlineRecord
//   archive.json          -> DugResult[] (one entry per collected search result)
//   digs/<NN>-<slug>.json -> DigRecord
//   jev-log.json          -> JevLogEntry[] (one entry per jev /api/decide HTTP request)

/** preflight.json: environment probe results before the dig. */
export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: string[];
    unresponsive_engines: string[];
  };
  decide: {
    url: string;
    model: string | null;
    probe_answer: unknown | null;
  };
}

/** outline.json: topic decomposition plus the jev score validation. */
export interface OutlineRecord {
  topic: string;
  subtopics: Array<{
    nn: string;
    slug: string;
    scope: string;
    seed_queries: string[];
  }>;
  validation: {
    metric: "score";
    criteria: string[];
    model: string | null;
    answers: Record<string, unknown>;
    usage: { input_tokens: number; output_tokens: number } | null;
    dropped: string[];
    kept: string[];
  };
}

/** Raw jev answer object as returned by /api/decide. */
export interface DecisionAnswer {
  type: string;
  noul?: number;
  score?: number;
  probabilities?: Record<string, number>;
  confidence?: number;
  legend?: Record<string, string>;
}

/** archive.json entry: one collected search result with its jev weight. */
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

/** The full decision record attached to a weighted result. */
export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  answer: DecisionAnswer;
  usage: { input_tokens: number | null; output_tokens: number | null };
  requested_at: string;
}

/** digs/<NN>-<slug>.json: per-subtopic dig record. */
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

/** jev-log.json entry: one jev /api/decide HTTP request. */
export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string | null;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens: number | null; output_tokens: number | null };
}
