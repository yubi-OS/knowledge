// db.ts - TypeScript interfaces matching the research-db files of knowledge/claims-boundaries/
// File -> interface mapping:
//   research-db/preflight.json        -> PreflightRecord
//   research-db/outline.json          -> OutlineRecord
//   research-db/archive.json          -> DugResult[] (JSON array)
//   research-db/digs/<NN>-<slug>.json -> DigRecord
//   research-db/jev-log.json          -> JevLogEntry[] (JSON array)

export interface DugResult {
  query: string;            // searXNG query the result was collected under
  title: string;
  url: string;
  snippet: string;
  collected_at: string;     // ISO 8601 UTC
  weight: number | null;    // jev noul probability; >= 0.5 counts as primary backing
  decision: DecisionRecord | null;
  redo_of: number | null;   // index of a superseded entry this one was rescored from
}

export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: string;            // "clef"
  answer: Record<string, unknown>; // raw answer object (probabilities / legend / confidence / noul)
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string;
}

export interface DigRecord {
  nn: string;               // zero-padded doc number
  slug: string;
  scope: string;
  queries_attempted: Array<{ query: string; attempt: number; raw_results: number; kept: number }>;
  redo_count: number;
  redo_log: Array<{ attempt: number; reason: string; new_queries: string[] }>;
  results_kept: string[];   // urls of kept results
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

export interface OutlineRecord {
  topic: string;
  subtopics: Array<{ nn: string; slug: string; scope: string; seed_queries: string[] }>;
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, { score: number; legend: Record<string, string>; probabilities: Record<string, number>; confidence: number }>;
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
  searxng: { url: string; probe_results: number; unresponsive_engines: string[][] };
  decide: { url: string; model: string; probe_answer: Record<string, unknown> };
}
