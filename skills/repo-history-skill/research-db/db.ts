// research-db type map: each file maps to one interface (digs/*.json all share DigRecord).
// preflight.json -> PreflightRecord
export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string; unresponsive_engines: string[] };
  decide: { url: string; model: string; probe_answer: string };
}

// outline.json -> OutlineRecord
export interface OutlineRecord {
  topic: string;
  ground_source: string;
  subtopics: { nn: number; slug: string; scope: string; seed_queries: string[] }[];
  validation: {
    metric: string;
    criteria: string[];
    model: string;
    answers: Record<string, { score: number; probabilities: Record<string, number>; confidence: number; legend: Record<string, string> }>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: number[];
    kept: number[];
  };
}

// archive.json (JSON array of DugResult)
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

// archive.json[].decision -> DecisionRecord
export interface DecisionRecord {
  type: string;
  instructions: string;
  model: string;
  answer: { type: string; noul: number };
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string;
}

// digs/<NN>-<slug>.json -> DigRecord
export interface DigRecord {
  nn: number;
  slug: string;
  scope: string;
  queries_attempted: { query: string; attempt: number; raw_results: number; kept: number }[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

// jev-log.json (JSON array of JevLogEntry)
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
