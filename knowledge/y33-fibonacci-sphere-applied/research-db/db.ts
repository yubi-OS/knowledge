// research-db type map (schema v2)
// preflight.json  -> PreflightRecord
// outline.json    -> OutlineRecord
// archive.json    -> DugResult[] (one entry per collected result, JSON array)
// digs/*.json     -> DigRecord
// jev-log.json    -> JevLogEntry[]

export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;            // "clef"
  answer: Record<string, unknown>; // raw answer object from /api/decide
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string;
}

export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;    // jev noul probability; null only if unweightable
  decision: DecisionRecord;
  redo_of: number | null;   // index of superseded entry when rescored
}

export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: { query: string; attempt: number; raw_results: number; kept: number }[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

export interface OutlineRecord {
  topic: string;
  subtopics: { nn: string; slug: string; scope: string; seed_queries: string[] }[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, { score: number; probabilities?: Record<string, number>; confidence?: number; legend?: Record<string, string> }>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[];
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
  searxng: { url: string; probe_results: number; unresponsive_engines: unknown };
  decide: { url: string; model: string; probe_answer: number };
}
