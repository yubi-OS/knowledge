// research-db schema v2 for skills/nss-audience (yubi-OS/knowledge)
// File -> interface mapping:
//   research-db/preflight.json          -> PreflightRecord
//   research-db/outline.json            -> OutlineRecord
//   research-db/archive.json            -> DugResult[] (array of DugResult)
//   research-db/digs/<NN>-<slug>.json   -> DigRecord
//   research-db/jev-log.json            -> JevLogEntry[] (array of JevLogEntry)

export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  answer: unknown; // raw answer object as returned by the decision model
  usage?: { input_tokens: number; output_tokens: number };
  requested_at?: string;
}

export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null; // probability from the noul decision; null only if unscored
  decision: DecisionRecord;
  redo_of: number | null; // index of superseded unweighted entry, if rescored
}

export interface QueryAttempt {
  query: string;
  attempt: number; // 1 = original, 2+ = redo
  raw_results: number;
  kept: { title: string; url: string; content: string }[];
  error?: string;
}

export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: QueryAttempt[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
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
    answers: Record<string, { score: number; probabilities: Record<string, number>; confidence: number; legend?: unknown }>;
    usage: unknown;
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
  decide: { url: string; model: string; probe_answer: string };
}
