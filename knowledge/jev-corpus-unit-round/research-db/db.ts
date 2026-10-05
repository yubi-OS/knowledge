// research-db file -> interface map
// preflight.json             -> PreflightRecord
// outline.json               -> OutlineRecord
// archive.json               -> DugResult[]
// digs/<NN>-<slug>.json      -> DigRecord
// jev-log.json               -> JevLogEntry[]

// A decision-model answer as returned by /api/decide (model: clef).
export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: "clef";
  answer: Record<string, unknown>; // raw answer object (probabilities / noul / score / confidence)
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string; // ISO 8601 UTC
}

// One collected search result, with its noul weight. archive.json is DugResult[].
export interface DugResult {
  query: string; // the searXNG query it came from
  title: string;
  url: string;
  snippet: string;
  collected_at: string; // ISO 8601 UTC
  weight: number | null; // noul probability; null if it could never be scored
  decision: DecisionRecord;
  redo_of: number | null; // index of the superseded unweighted entry when rescored
}

// One subtopic's dig record. digs/<NN>-<slug>.json is DigRecord.
export interface DigRecord {
  nn: string; // "01".."09"
  slug: string;
  scope: string;
  queries_attempted: { query: string; attempt: number; raw_results: number; kept: number; error?: string }[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[]; // urls kept for this subtopic
  outcome: "authored" | "skipped";
  skip_reason?: string; // present when outcome is "skipped"
}

// outline.json as stored.
export interface OutlineRecord {
  topic: string;
  subtopics: { nn: string; slug: string; scope: string; seed_queries: [string, string] }[];
  validation: {
    metric: "score";
    criteria: string[]; // ["padding: drop", "marginal: ...", "load-bearing: ..."]
    model: string;
    answers: Record<string, { score: number; probabilities: Record<string, number>; confidence: number; legend: string }>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[]; // nn values dropped (score 0)
    kept: string[]; // nn values kept
  };
}

// One /api/decide HTTP request. jev-log.json is JevLogEntry[].
export interface JevLogEntry {
  requested_at: string; // ISO 8601 UTC
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens: number; output_tokens: number };
}

// preflight.json as stored.
export interface PreflightRecord {
  date: string; // "2026-10-05"
  searxng: {
    url: string;
    probe_results: { probed_at: string; probe_query: string; healthy: boolean; returned_results_array: boolean };
    unresponsive_engines: string[];
  };
  decide: {
    url: string;
    model: string;
    probe_answer: Record<string, unknown>;
  };
}
