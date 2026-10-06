// db.ts - interfaces for the docker-login-action research-db (schema v2)
// File mapping:
//   research-db/preflight.json            -> PreflightRecord
//   research-db/outline.json              -> OutlineRecord
//   research-db/archive.json              -> DugResult[]  (one entry per collected result)
//   research-db/digs/<NN>-<slug>.json     -> DigRecord
//   research-db/jev-log.json              -> JevLogEntry[]

export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: string;
    unresponsive_engines?: string[];
  };
  decide: {
    url: string;
    model: string;
    probe_answer?: string | null;
    note?: string;
  };
}

export interface OutlineSubtopic {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
  dig_mode?: "web" | "internal-record";
}

export interface ScoreAnswer {
  score: number;
  probabilities: Record<string, number>;
  confidence: number;
  legend: Record<string, string>;
}

export interface OutlineRecord {
  topic: string;
  subtopics: OutlineSubtopic[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, ScoreAnswer>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[];
    kept: string[];
  };
}

export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: "clef";
  answer: unknown; // raw answer object as returned by the decision model
  usage: { input_tokens: number | null; output_tokens: number | null };
  requested_at: string;
}

export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null; // jev noul probability; null only when unscored after redos
  decision: DecisionRecord;
  redo_of: number | null; // index of the superseded unweighted entry when rescored
  sub?: string; // "<NN>-<slug>" subtopic tag
}

export interface QueryAttempt {
  query: string;
  attempt: number;
  raw_results: number;
  kept: number;
}

export interface RedoLogEntry {
  attempt: number;
  reason: string;
  new_queries: string[];
}

export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: QueryAttempt[];
  redo_count: number;
  redo_log: RedoLogEntry[];
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
