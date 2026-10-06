// research-db type map for jev-orchestrator-solo
// File -> interface mapping:
//   preflight.json  -> PreflightRecord
//   outline.json    -> OutlineRecord
//   archive.json    -> DugResult[] (one entry per collected result)
//   digs/*.json     -> DigRecord (one file per subtopic dig)
//   jev-log.json    -> JevLogEntry[] (one entry per jev HTTP request)

// preflight.json
export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: number;
    unresponsive_engines: string[];
  };
  decide: {
    url: string;
    model: string;
    probe_answer: string;
  };
}

// outline.json
export interface OutlineRecord {
  topic: string;
  subtopics: Array<{
    nn: string;
    slug: string;
    scope: string;
    seed_queries: string[];
  }>;
  validation: {
    metric: string;
    criteria: string[];
    model: string;
    answers: Record<string, unknown>; // raw per-question answer objects (score, probabilities, ...)
    usage: { input_tokens: number; output_tokens: number } | null;
    dropped: string[]; // nn values scoring 0
    kept: string[];
  };
}

// archive.json entries
export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  answer: unknown; // raw answer object from /api/decide, e.g. { type: "noul", noul: 0.82 }
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string;
  metric?: string;
}

export interface DugResult {
  query: string;
  nn: string; // owning subtopic number
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null; // noul probability; null until weighted
  decision: DecisionRecord | null;
  redo_of: number | null; // index of superseded unweighted entry when rescored
}

// digs/<NN>-<slug>.json
export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: Array<{
    query: string;
    attempt: number;
    raw_results: number;
    kept: number;
  }>;
  redo_count: number;
  redo_log: Array<{ attempt: number; reason: string; new_queries: string[] }>;
  results_kept: string[]; // urls
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

// jev-log.json entries
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
