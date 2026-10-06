// research-db/db.ts - TypeScript interfaces for every shape stored in this research DB.
// File -> interface mapping:
//   preflight.json -> PreflightRecord
//   outline.json   -> OutlineRecord
//   archive.json   -> DugResult[] (each with a DecisionRecord)
//   digs/<NN>-<slug>.json -> DigRecord
//   jev-log.json   -> JevLogEntry[]

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
    note?: string;
    probe_answer?: string;
  };
}

export interface OutlineSubtopic {
  nn: number;
  slug: string;
  scope: string;
  seed_queries: string[];
  dig?: "web-shaped" | "internal-record";
}

export interface OutlineAnswer {
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
    answers: Record<string, OutlineAnswer>;
    usage: { input_tokens: number; output_tokens: number };
    response_id: string;
    dropped: number[];
    kept: number[];
  };
}

export interface DecisionRecord {
  type: "noul" | "choice" | "score";
  instructions: string;
  model: "clef";
  answer: Record<string, unknown>; // raw answer object as returned by the decision API
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string;
  endpoint?: string;
}

export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord;
  redo_of: number | null; // index of the superseded unweighted entry when a result was rescored
  subtopic?: string; // NN slug this result belongs to
}

export interface DigQueryAttempt {
  query: string;
  attempt: number;
  raw_results: number;
  kept: number;
}

export interface DigRedoLogEntry {
  attempt: number;
  reason: string;
  new_queries: string[];
}

export interface DigRecord {
  nn: number;
  slug: string;
  scope: string;
  queries_attempted: DigQueryAttempt[];
  redo_count: number;
  redo_log: DigRedoLogEntry[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
  note?: string; // e.g. "internal-record subtopic, no dig"
}

export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens: number; output_tokens: number };
  response_id?: string;
  consumed?: string;
}
