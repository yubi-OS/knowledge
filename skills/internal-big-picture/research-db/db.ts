// db.ts - TypeScript interfaces for the skills/internal-big-picture research-db (schema v2).
// File -> interface mapping:
//   research-db/preflight.json          -> PreflightRecord
//   research-db/outline.json            -> OutlineRecord
//   research-db/archive.json            -> DugResult[] (one entry per collected dig result)
//   research-db/digs/<NN>-<slug>.json   -> DigRecord
//   research-db/jev-log.json            -> JevLogEntry[] (one entry per jev HTTP request)

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

export interface SubtopicSpec {
  nn: number;
  slug: string;
  scope: string;
  seed_queries: string[];
  dig: boolean;
}

export interface OutlineRecord {
  topic: string;
  source_doc: string;
  subtopics: SubtopicSpec[];
  validation: {
    metric: "score";
    endpoint: string;
    criteria: string[];
    model: string;
    answers: Record<string, {
      type: "score";
      score: number;
      legend: Record<string, string>;
      probabilities: Record<string, number>;
      confidence: number;
    }>;
    usage: { input_tokens?: number; output_tokens?: number; cost?: number } | Record<string, never>;
    dropped: number[];
    kept: number[];
    note: string;
  };
}

export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: "clef";
  answer: Record<string, unknown>; // raw answer object, e.g. {"type":"noul","noul":0.93}
  usage: { input_tokens: number | null; output_tokens: number | null };
  requested_at: string;
}

export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord;
  redo_of: number | null; // index of the superseded unweighted entry when rescored
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
  nn: number;
  slug: string;
  scope: string;
  queries_attempted: QueryAttempt[];
  redo_count: number;
  redo_log: RedoLogEntry[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
  note?: string; // present on internal-record subtopics: "internal-record subtopic, no dig"
}

export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: ("score" | "noul" | "choice")[];
  usage: { input_tokens?: number | null; output_tokens?: number | null; cost?: number | null };
}
