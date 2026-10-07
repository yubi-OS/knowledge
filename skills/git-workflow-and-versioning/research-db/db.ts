// research-db/db.ts — TypeScript interfaces for the skills/git-workflow-and-versioning research database.
// File -> interface mapping:
//   preflight.json      -> PreflightRecord
//   outline.json        -> OutlineRecord
//   archive.json        -> DugResult[]
//   digs/<NN>-<slug>.json -> DigRecord
//   jev-log.json        -> JevLogEntry[]

/** preflight.json — campaign preflight is run orchestrator-side; this file records the endpoints and that fact. */
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
    note: string;
  };
}

/** outline.json — topic decomposition plus the jev score validation of every subtopic. */
export interface OutlineRecord {
  topic: string;
  subtopics: Array<{
    nn: string;
    slug: string;
    scope: string;
    seed_queries: string[];
    internal?: boolean;
  }>;
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    endpoint: string;
    answers: Record<string, {
      type: string;
      score: number;
      legend: Record<string, string>;
      probabilities: Record<string, number>;
      confidence: number;
    }>;
    usage: Usage;
    dropped: string[];
    kept: string[];
    kept_note?: Record<string, string>;
  };
}

/** archive.json entry — one collected searXNG result with its noul weighting decision. */
export interface DugResult {
  query: string;
  title: string | null;
  url: string | null;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord;
  redo_of: number | null;
}

export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: string;
  endpoint: string;
  answer: unknown;
  usage: {
    input_tokens: number | null;
    output_tokens: number | null;
  };
  requested_at: string;
}

/** digs/<NN>-<slug>.json — per-subtopic dig record. */
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

/** jev-log.json entry — one jev HTTP request. */
export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: Usage;
  attempt?: number;
}

export interface Usage {
  input_tokens: number | null;
  output_tokens: number | null;
}
