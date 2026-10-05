// research-db schema v2 for knowledge/complex-ginzburg-landau-skill-emergence/
// File -> interface map:
//   preflight.json            -> PreflightRecord
//   outline.json              -> OutlineRecord
//   archive.json              -> DugResult[]
//   digs/<NN>-<slug>.json     -> DigRecord
//   jev-log.json              -> JevLogEntry[]

/** preflight.json - endpoint health probes taken before the dig. */
export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: number;
    unresponsive_engines: string[] | null;
  };
  decide: {
    url: string;
    model: string;
    probe_answer: unknown;
  };
}

/** archive.json - one entry per collected search result, with its jev weight. */
export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  /** jev noul probability; null until weighted. >= 0.5 = primary/authoritative. */
  weight: number | null;
  decision: DecisionRecord | null;
  /** index of the superseded unweighted entry when this result was rescored. */
  redo_of: number | null;
}

/** Full record of one decision-model call backing a weight. */
export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  /** raw answer object from /api/decide (probabilities, legend, confidence when present) */
  answer: unknown;
  usage: { input_tokens: number; output_tokens: number } | null;
  requested_at: string;
}

/** digs/<NN>-<slug>.json - the dig record for one subtopic doc. */
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

/** outline.json - topic decomposition plus the jev score validation. */
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
    answers: Record<string, unknown>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[];
    kept: string[];
  };
}

/** jev-log.json - one entry per jev /api/decide HTTP request. */
export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: ("score" | "noul" | "choice")[];
  usage: { input_tokens: number; output_tokens: number };
  attempt?: number;
}
