// research-db type interfaces for the fractalrabbit-falsification-harness corpus.
// File mapping:
//   research-db/preflight.json -> PreflightRecord
//   research-db/outline.json   -> OutlineRecord
//   research-db/archive.json   -> DugResult[] (the archive is a JSON array of DugResult)
//   research-db/digs/<NN>-<slug>.json -> DigRecord (one per subtopic)
//   research-db/jev-log.json   -> JevLogEntry[] (a JSON array of JevLogEntry)

// From research-db/preflight.json: environment probes taken before the mint.
export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: { query: string; results: number; status: number }[];
    unresponsive_engines: string[];
  };
  decide: {
    url: string;
    model: string;
    probe_answer: { status: number; model: string; note: string };
  };
}

// From research-db/outline.json: the decomposed topic and its jev score validation.
export interface OutlineRecord {
  topic: string;
  subtopics: { nn: string; slug: string; scope: string; seed_queries: string[] }[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, {
      score: number | null;
      probabilities: Record<string, number> | null;
      confidence: number | null;
      legend: Record<string, string> | null;
    }>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[]; // subtopic nn values
    kept: string[];    // subtopic nn values
  };
}

// From research-db/archive.json (array): one collected search result and its jev decision.
export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: string;
  answer: Record<string, unknown>; // raw answer object returned by /api/decide (e.g. {"type":"noul","noul":0.83})
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string;
}

export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null; // null until weighted; probability that the source is authoritative
  decision: DecisionRecord | null;
  redo_of: number | null; // index of the superseded unweighted entry when rescored
}

// From research-db/digs/<NN>-<slug>.json: per-subtopic dig record.
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

// From research-db/jev-log.json (array): one entry per jev HTTP request.
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
