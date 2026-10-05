// research-db/db.ts - TypeScript interfaces for the pq-timeline-alignment research DB.
// File mapping:
//   preflight.json        -> PreflightRecord
//   outline.json          -> OutlineRecord
//   archive.json          -> DugResult[] (each with a DecisionRecord)
//   digs/<NN>-<slug>.json -> DigRecord
//   jev-log.json          -> JevLogEntry[]

/** research-db/preflight.json */
export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: number; unresponsive_engines: string[] };
  decide: { url: string; model: string; probe_answer: Record<string, unknown> };
}

/** research-db/outline.json */
export interface OutlineRecord {
  topic: string;
  subtopics: Array<{
    nn: string;
    slug: string;
    scope: string;
    seed_queries: string[];
  }>;
  validation: {
    metric: string;
    criteria: string[];
    model: string;
    answers: Record<string, {
      score: number;
      legend: Record<string, string>;
      probabilities: Record<string, number>;
      confidence: number;
    }>;
    usage: Record<string, unknown>;
    dropped: string[];
    kept: string[];
  };
}

/** One collected search result. research-db/archive.json is DugResult[]. */
export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord;
  redo_of: string | null;
}

/** The jev decision backing one DugResult. */
export interface DecisionRecord {
  type: 'noul';
  instructions: string;
  model: string;
  answer: Record<string, unknown>;
  usage: { input_tokens?: number; output_tokens?: number };
  requested_at: string;
}

/** research-db/digs/<NN>-<slug>.json */
export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: Array<{ query: string; attempt: number; raw_results: number; kept: number }>;
  redo_count: number;
  redo_log: Array<{ attempt: number; reason: string; new_queries?: string[] }>;
  results_kept: string[];
  outcome: 'authored' | 'skipped';
  skip_reason?: string;
}

/** research-db/jev-log.json is JevLogEntry[]. One entry per jev HTTP request. */
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
