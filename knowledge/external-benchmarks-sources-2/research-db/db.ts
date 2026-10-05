// db.ts - TypeScript interfaces for the research-db files of knowledge/external-benchmarks-sources-2.
// File mapping: preflight.json -> PreflightRecord; outline.json -> OutlineRecord;
// archive.json -> DugResult[]; research-db/digs/*.json -> DigRecord;
// jev-log.json -> JevLogEntry[].

export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  answer: unknown; // raw answer object from /api/decide (e.g. { noul: number } or { score, probabilities, confidence })
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string;
}

export interface DugResult {
  query: string;
  title: string | null;
  url: string;
  snippet: string;
  collected_at: string; // ISO date of the dig
  weight: number | null; // jev noul probability; null if unweighted
  decision: DecisionRecord | null;
  redo_of: number | null; // index of superseded entry when a result was rescored
}

export interface QueryAttempt {
  query: string;
  attempt: number; // 1 = original, 2..n = redo passes
  raw_results: number;
  kept: number;
}

export interface RedoLogEntry {
  attempt: number;
  reason: string;
  new_queries: string[];
}

export interface DigRecord {
  nn: string; // zero-padded outline number
  slug: string;
  scope: string;
  queries_attempted: QueryAttempt[];
  redo_count: number;
  redo_log: RedoLogEntry[];
  results_kept: string[]; // urls
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

export interface SubtopicSpec {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
}

export interface OutlineRecord {
  topic: string;
  subtopics: SubtopicSpec[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, {
      score: number;
      probabilities: Record<string, number>;
      confidence: number;
      legend: Record<string, string>;
    }>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[];
    kept: string[];
  };
}

export interface JevLogEntry {
  requested_at: string;
  endpoint: string; // /api/decide
  state: string; // corpus ref
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens: number; output_tokens: number };
  note?: string;
}

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: number; unresponsive_engines: unknown[] };
  decide: { url: string; model: string; probe_answer: unknown };
}
