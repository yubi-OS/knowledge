// research-db type interfaces for knowledge/openwrt-deception-proof-plan
//
// File -> interface mapping:
//   research-db/preflight.json  -> PreflightRecord
//   research-db/outline.json    -> OutlineRecord
//   research-db/archive.json    -> DugResult[] (the file is a JSON array)
//   research-db/digs/<NN>-<slug>.json -> DigRecord
//   research-db/jev-log.json    -> JevLogEntry[] (the file is a JSON array)

export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: number | null;
    unresponsive_engines: string[];
  };
  decide: {
    url: string;
    model: string;
    probe_answer: unknown;
  };
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
    metric: string;
    criteria: string[];
    model: string;
    answers: Record<string, unknown>;
    usage: Record<string, unknown>;
    dropped: string[];
    kept: string[];
    dropped_note?: string;
  };
}

export interface DecisionRecord {
  type: string;
  instructions: string;
  model: string;
  answer: unknown;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
  requested_at: string;
}

export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord | null;
  redo_of: string | null;
}

export interface DigQueryAttempt {
  query: string;
  attempt: number;
  raw_results: number;
  kept: number;
}

export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: DigQueryAttempt[];
  redo_count: number;
  redo_log: Array<{
    attempt: number;
    reason: string;
    new_queries: string[];
  }>;
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}
