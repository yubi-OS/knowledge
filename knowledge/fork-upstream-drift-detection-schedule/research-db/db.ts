// research-db type map: file -> interface
// preflight.json            -> PreflightRecord
// outline.json              -> OutlineRecord
// archive.json              -> DugResult[] (DecisionRecord embedded)
// digs/<NN>-<slug>.json     -> DigRecord
// jev-log.json              -> JevLogEntry[]

export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string; // "clef"
  answer: Record<string, unknown>; // raw answer object incl. probabilities/legend/confidence
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string; // ISO 8601 UTC
}

export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string; // ISO 8601 UTC
  weight: number | null; // noul probability; null until weighted
  decision: DecisionRecord;
  redo_of: number | null; // index of superseded entry when a result was rescored
  nn: string; // subtopic number, e.g. "01"
  slug: string; // subtopic slug
  attempt: number; // dig attempt (1 = original, 2 = redo)
}

export interface QueryAttempt {
  query: string;
  attempt: number;
  raw_results: number;
  kept: number;
  error?: string;
}

export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: QueryAttempt[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[]; // urls
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

export interface OutlineSubtopic {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
}

export interface OutlineRecord {
  topic: string;
  subtopics: OutlineSubtopic[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<
      string,
      {
        score: number;
        probabilities: Record<string, number>;
        confidence: number;
        legend: Record<string, string>;
      }
    >;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[];
    drop_reason: Record<string, string>;
    kept: string[];
  };
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
}

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: number; unresponsive_engines: string[] };
  decide: { url: string; model: string; probe_answer: number | null };
}
