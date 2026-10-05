// research-db/db.ts — TypeScript interfaces for the wayfinder-math-implementation research DB.
// File -> interface map:
//   preflight.json            -> PreflightRecord
//   outline.json              -> OutlineRecord
//   archive.json              -> DugResult[] (each carries a DecisionRecord)
//   digs/<NN>-<slug>.json     -> DigRecord
//   jev-log.json              -> JevLogEntry[]

/** preflight.json: one probe per endpoint before the mint ran. */
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
    probe_answer: unknown;
  };
}

/** outline.json: topic decomposition plus the jev score validation of every subtopic. */
export interface OutlineRecord {
  topic: string;
  subtopics: Array<{
    nn: number;
    slug: string;
    scope: string;
    seed_queries: string[];
  }>;
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, {
      score: number;
      probabilities: unknown;
      confidence: number;
      legend: unknown;
    }>;
    usage: { input_tokens: number; output_tokens: number } | null;
    dropped: number[];
    kept: number[];
  };
}

/** archive.json entry: one collected result with its jev noul weighting decision. */
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

/** The raw decision record stored alongside every weighted result. */
export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  answer: unknown;
  usage: { input_tokens: number; output_tokens: number } | null;
  requested_at: string;
}

/** digs/<NN>-<slug>.json: the dig record for one subtopic, including redos. */
export interface DigRecord {
  nn: number;
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

/** jev-log.json: one entry per jev HTTP request made during the mint. */
export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens: number; output_tokens: number } | null;
}
