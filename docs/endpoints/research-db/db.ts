// research-db/db.ts - TypeScript interfaces matching every file shape in research-db/
// File mapping:
//   preflight.json            -> PreflightRecord
//   outline.json              -> OutlineRecord
//   archive.json              -> DugResult[] (one entry per collected result)
//   digs/<NN>-<slug>.json     -> DigRecord
//   jev-log.json              -> JevLogEntry[] (one entry per jev HTTP request)

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string };
  decide: { url: string; model: string; note?: string };
}

export interface OutlineSubtopic {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
}

export interface OutlineAnswer {
  score: number;
  probabilities: Record<string, number>;
  confidence: number;
  legend: Record<string, string>;
}

export interface OutlineRecord {
  topic: string;
  source_doc: string;
  subtopics: OutlineSubtopic[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    endpoint: string;
    answers: Record<string, OutlineAnswer>;
    usage: UsageTokens | null;
    dropped: string[];
    kept: string[];
  };
}

export interface DecisionRecord {
  type: string;
  instructions: string;
  model: string;
  answer: unknown;
  usage: UsageTokens | null;
  requested_at: string;
}

export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord;
  redo_of: number | null;
}

export interface QueryAttempt {
  query: string;
  attempt: number;
  raw_results: unknown;
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

export interface UsageTokens {
  input_tokens: number | null;
  output_tokens: number | null;
}

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
