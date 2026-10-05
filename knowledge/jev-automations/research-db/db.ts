// research-db/db.ts - TypeScript interfaces for the jev-automations research-db.
// File -> interface mapping:
//   research-db/preflight.json            -> PreflightRecord
//   research-db/outline.json              -> OutlineRecord
//   research-db/archive.json              -> DugResult[] (JSON array)
//   research-db/digs/<NN>-<slug>.json     -> DigRecord (one per subtopic)
//   research-db/jev-log.json              -> JevLogEntry[] (JSON array)

/** research-db/preflight.json */
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
    probe_answer: number;
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
      score: number;
      probabilities: Record<string, number>;
      confidence: number;
      legend: Record<string, string>;
      type: string;
    }>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[];
    kept: string[];
  };
}

/** One entry of research-db/archive.json */
export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  /** null only before scoring; every shipped entry carries a float weight */
  weight: number | null;
  decision: DecisionRecord | null;
  /** index of the superseded unweighted entry when this result was rescored */
  redo_of: null | number;
}

/** Full record of one jev /api/decide decision */
export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: "clef";
  answer: object; // raw answer object incl. probabilities/legend/confidence
  usage: { input_tokens: number; output_tokens: number };
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
  }[];
  redo_count: number;
  redo_log: {
    attempt: number;
    reason: string;
    new_queries: string[];
  }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

/** One entry of research-db/jev-log.json */
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
