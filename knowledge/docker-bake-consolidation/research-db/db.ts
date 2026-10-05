---
contract: "What belongs in this file and when to route facts here."
short_description: "One-line label"
---
# Research database TypeScript interfaces

File -> interface mapping:
- research-db/preflight.json -> PreflightRecord
- research-db/outline.json -> OutlineRecord
- research-db/archive.json -> DugResult[] (JSON array of DugResult)
- research-db/digs/<NN>-<slug>.json -> DigRecord
- research-db/jev-log.json -> JevLogEntry[] (JSON array of JevLogEntry)

export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  answer: Record<string, unknown>;
  usage: { input_tokens: number; output_tokens: number };
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
  raw_results: number;
  kept: number;
}

export interface RedoLogEntry {
  attempt: number;
  reason: string;
  new_queries: string[];
}

export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: QueryAttempt[];
  redo_count: number;
  redo_log: RedoLogEntry[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

export interface Subtopic {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
}

export interface OutlineValidationAnswer {
  score: number;
  probabilities: Record<string, number>;
  confidence: number;
  legend: Record<string, string>;
}

export interface OutlineRecord {
  topic: string;
  subtopics: Subtopic[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, OutlineValidationAnswer>;
    usage: { input_tokens: number; output_tokens: number };
    requested_at: string;
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
  searxng: { url: string; probe_results: number | null; unresponsive_engines: string[] };
  decide: { url: string; model: string | null; probe_answer: Record<string, unknown> | null };
}
