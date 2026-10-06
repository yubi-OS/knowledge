// research-db/db.ts - TypeScript interfaces for every shape stored in this research DB.
// File -> interface mapping:
//   preflight.json            -> PreflightRecord
//   outline.json              -> OutlineRecord
//   archive.json              -> DugResult[] (each entry carries a DecisionRecord)
//   digs/<NN>-<slug>.json     -> DigRecord
//   jev-log.json              -> JevLogEntry[]

// preflight.json: one record per mint, proving both endpoints were probed before use.
export interface PreflightRecord {
  date: string; // mint date, YYYY-MM-DD
  searxng: {
    url: string;
    probe_results: number; // result count returned by the probe query
    unresponsive_engines: string[];
  };
  decide: {
    url: string;
    model: string; // e.g. "clef"
    probe_answer: unknown; // raw answer object from the probe question
  };
}

// outline.json: the decomposition plus the jev score validation of every subtopic.
export interface OutlineRecord {
  topic: string;
  subtopics: {
    nn: string; // two-digit outline order
    slug: string;
    scope: string;
    seed_queries: string[];
  }[];
  validation: {
    metric: "score";
    criteria: string[]; // lowest-first criteria list
    model: string;
    answers: Record<
      string,
      {
        score: number;
        probabilities?: Record<string, number>;
        confidence?: number;
        legend?: Record<string, string>;
      }
    >;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[]; // nn values dropped (score 0)
    kept: string[]; // nn values kept
  };
}

// archive.json entries: every collected search result with its weighting decision.
export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  answer: unknown; // raw answer object including the probability value
  usage: { input_tokens: number | null; output_tokens: number };
  requested_at: string; // ISO 8601
}

export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string; // ISO 8601
  weight: number | null; // null only if the result could never be scored
  decision: DecisionRecord;
  redo_of: number | null; // index of the superseded entry when a result was rescored
}

// digs/<NN>-<slug>.json: per-subtopic dig record including redo history.
export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: {
    query: string;
    attempt: number; // 1 = first pass, 2+ = redo
    raw_results: number;
    kept: number;
  }[];
  redo_count: number;
  redo_log: {
    attempt: number;
    reason: string;
    new_queries: string[];
  }[];
  results_kept: string[]; // urls backing the authored doc
  outcome: "authored" | "skipped";
  skip_reason?: string; // present only when outcome is "skipped"
}

// jev-log.json: one entry per jev HTTP request made during the mint.
export interface JevLogEntry {
  requested_at: string; // ISO 8601
  endpoint: string; // e.g. "/api/decide"
  state: string; // jev state passed in the request body
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[]; // per-question metric, e.g. "score" | "noul"
  usage: { input_tokens: number; output_tokens: number };
}
