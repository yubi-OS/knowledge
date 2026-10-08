// research-db/db.ts — TypeScript interfaces for the schema-v2 research database.
// File -> interface mapping:
//   preflight.json        -> PreflightRecord
//   outline.json          -> OutlineRecord
//   archive.json          -> DugResult[] (a JSON array of DugResult)
//   digs/<NN>-<slug>.json -> DigRecord (one file per outline subtopic)
//   jev-log.json          -> JevLogEntry[] (a JSON array of JevLogEntry)

// archive.json entry: one collected dig result with its jev weighting decision.
export interface DugResult {
  query: string; // dig query key, e.g. "t01a"
  title: string;
  url: string;
  snippet: string;
  collected_at: string; // ISO 8601 UTC
  weight: number | null; // jev noul probability; null only if unweighted
  decision: {
    type: "noul";
    instructions: string;
    model: "clef"; // decision-model family recorded per schema v2
    answer: unknown; // raw answer object as returned by the decision model
    usage: { input_tokens: number; output_tokens: number };
    requested_at: string;
  };
  redo_of: number | null; // index of the superseded entry when rescored
}

// outline.json: the outline decomposition plus the jev score validation.
export interface OutlineRecord {
  topic: string;
  subtopics: {
    nn: string; // "01".."09"
    slug: string;
    scope: string;
    seed_queries: [string, string] | []; // empty for internal-record subtopics
  }[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, unknown>; // key -> { score, probabilities, confidence, legend }
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[]; // nn values dropped at score 0
    kept: string[];
  };
}

// digs/<NN>-<slug>.json: per-subtopic dig record.
export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: {
    query: string;
    attempt: number;
    raw_results: number;
    kept: string[]; // urls kept from this query
  }[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

// jev-log.json: one entry per jev HTTP request.
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

// preflight.json: campaign preflight record (orchestrator-side, per variant delta 3).
export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string; unresponsive_engines: string[] };
  decide: { url: string; model: string; probe_answer: string | null; note?: string };
}
