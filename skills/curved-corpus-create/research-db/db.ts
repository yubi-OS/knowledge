// research-db schema v2 for skills/curved-corpus-create in yubi-OS/knowledge
// File -> interface mapping:
//   preflight.json            -> PreflightRecord
//   outline.json              -> OutlineRecord
//   archive.json              -> DugResult[] (one entry per collected result)
//   digs/NN-<slug>.json       -> DigRecord
//   jev-log.json              -> JevLogEntry[] (one entry per jev HTTP request)

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string };
  decide: { url: string; model: string; note?: string; probe_answer?: string };
}

export interface Subtopic {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
  dig: boolean;
  score?: number;
}

export interface OutlineRecord {
  topic: string;
  subtopics: Subtopic[];
  validation: {
    metric: "score";
    endpoint: string;
    model: string;
    requested_at: string;
    criteria: string[];
    raw: unknown;
    usage: { input_tokens: number; output_tokens: number } | null;
    kept: string[];
    dropped: string[];
  };
  ground_source: { repo: string; path: string; url: string; bytes: number; fetched_at: string };
}

export interface DecisionRecord {
  type: "noul" | "score";
  instructions: string;
  model: string;
  answer: unknown;
  usage: { input_tokens: number; output_tokens: number } | null;
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
  redo_of: number | null;
  nn?: string;
}

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
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
  note?: string;
}

export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens: number; output_tokens: number } | null;
}
