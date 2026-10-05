// research-db type map
// preflight.json  -> PreflightRecord
// outline.json    -> OutlineRecord
// archive.json    -> DugResult[] (each with DecisionRecord)
// digs/*.json     -> DigRecord
// jev-log.json    -> JevLogEntry[]

export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: "clef";
  answer: unknown; // raw answer object, e.g. { type: "noul", noul: 0.95 }
  usage?: { input_tokens?: number; output_tokens?: number };
  requested_at: string;
}

export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  redo_of: number | null;
  decision: DecisionRecord;
}

export interface DigRecord {
  nn: number;
  slug: string;
  scope: string;
  queries_attempted: { query: string; attempt: number; raw_results: number; kept: number; error?: string }[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

export interface OutlineRecord {
  topic: string;
  subtopics: { nn: number; slug: string; scope: string; seed_queries: string[] }[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, { score?: number; probabilities?: Record<string, number>; confidence?: number; legend?: Record<string, string> }>;
    usage: { input_tokens?: number; output_tokens?: number };
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
  usage: { input_tokens?: number; output_tokens?: number };
}

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: number; probe_query?: string; unresponsive_engines: string[] };
  decide: { url: string; model: string; probe_answer: unknown };
}
