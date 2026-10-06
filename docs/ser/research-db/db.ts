// research-db type map for docs/ser (yubi-OS/knowledge)
// preflight.json        -> PreflightRecord
// outline.json          -> OutlineRecord
// archive.json          -> DugResult[] (JSON array of DugResult)
// digs/NN-<slug>.json   -> DigRecord
// jev-log.json          -> JevLogEntry[] (JSON array of JevLogEntry)

export interface DecisionRecord {
  type: string; // e.g. "noul" | "score"
  instructions: string;
  model: string; // "clef"
  answer: Record<string, unknown>; // raw answer object incl. probabilities / noul / legend / confidence
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string; // ISO 8601
}

export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord;
  redo_of: number | null; // index of superseded unweighted entry, or null
}

export interface DigAttempt {
  query: string;
  attempt: number;
  raw_results: number;
  kept: number;
}

export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: DigAttempt[];
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
    answers: Record<string, { score: number; probabilities: Record<string, number>; confidence: number }>;
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
  searxng: { url: string; probe_results: string; unresponsive_engines: string[] };
  decide: { url: string; model: string; note: string };
}
