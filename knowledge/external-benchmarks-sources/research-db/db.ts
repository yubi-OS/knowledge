// db.ts - TypeScript interfaces for the external-benchmarks-sources research-db (schema v2).
// File -> interface mapping:
//   preflight.json           -> PreflightRecord
//   outline.json             -> OutlineRecord
//   archive.json (array)     -> DugResult (with embedded DecisionRecord)
//   digs/<NN>-<slug>.json    -> DigRecord
//   jev-log.json (array)     -> JevLogEntry

// preflight.json - endpoint health probes taken before the dig.
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
    probe_answer: unknown;
  };
}

// outline.json - subtopic decomposition and the jev score validation of it.
export interface Subtopic {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
}

export interface OutlineRecord {
  topic: string;
  subtopics: Subtopic[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, unknown>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[];
    kept: string[];
  };
}

// The per-result decision record carried inside every DugResult.
export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: string;
  answer: unknown;
  usage: { input_tokens: number; output_tokens: number };
}

// archive.json - one entry per collected search result, jev-weighted.
export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord | null;
  redo_of: number | null;
}

// digs/<NN>-<slug>.json - per-subtopic dig record including redo history.
export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: {
    query: string;
    attempt: number;
    raw_results: number;
    kept: number;
  }[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

// jev-log.json - one entry per HTTP request to /api/decide.
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
