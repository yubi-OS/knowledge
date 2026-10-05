// research-db schema v2 - file -> interface map
// preflight.json -> PreflightRecord
// outline.json -> OutlineRecord
// archive.json -> DugResult[]
// digs/<NN>-<slug>.json -> DigRecord
// jev-log.json -> JevLogEntry[]

export interface UsageTokens {
  input_tokens: number;
  output_tokens: number;
}

// preflight.json
export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: { query: string; results_returned: number; healthy: boolean };
    unresponsive_engines: string[];
  };
  decide: { url: string; model: string; probe_answer: Record<string, unknown> };
}

// outline.json
export interface Subtopic {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
}
export interface OutlineRecord {
  topic: string;
  source_doc: string;
  subtopics: Subtopic[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, { score: number; probabilities?: Record<string, number>; confidence?: number; legend?: Record<string, string> }>;
    usage: UsageTokens;
    dropped: string[];
    kept: string[];
  };
}

// archive.json - one entry per collected search result
export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: string;
  answer: Record<string, unknown>;
  usage: UsageTokens; // request usage apportioned per question (request tokens / n_questions)
  requested_at: string;
}
export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null; // noul probability; >= 0.5 authoritative, < 0.5 weak
  decision: DecisionRecord;
  redo_of: number | null; // index of superseded unweighted entry when a result was rescored
}

// digs/<NN>-<slug>.json
export interface QueryAttempt {
  query: string;
  attempt: number;
  raw_results: number;
  kept: number;
}
export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: QueryAttempt[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[]; // urls
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

// jev-log.json - one entry per jev HTTP request
export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: UsageTokens;
}
