// research-db/db.ts - TypeScript interfaces for the rayleigh-integration-research corpus
// File -> interface mapping:
//   preflight.json         -> PreflightRecord
//   outline.json           -> OutlineRecord
//   archive.json           -> DugResult[]
//   digs/<NN>-<slug>.json  -> DigRecord
//   jev-log.json           -> JevLogEntry[]

/** research-db/preflight.json */
export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: number;
    unresponsive_engines: string[];
  };
  decide: {
    url: string;
    model: string;
    probe_answer: object;
  };
}

/** research-db/outline.json */
export interface OutlineRecord {
  topic: string;
  subtopics: Array<{
    nn: number;
    slug: string;
    scope: string;
    seed_queries: string[];
  }>;
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, {
      type: string;
      score: number;
      legend: Record<string, string>;
      probabilities: Record<string, number>;
      confidence: number;
    }>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: number[];
    kept: number[];
  };
  marginal_note?: string;
}

/** One collected search result in research-db/archive.json */
export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord | null;
  redo_of: number | null;
  // provenance extension: which subtopic the result was dug for
  subtopic_nn: number;
  subtopic_slug: string;
}

/** The jev decision stored alongside each weighted result (archive.json) */
export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: string;
  answer: object;
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string;
}

/** research-db/digs/<NN>-<slug>.json */
export interface DigRecord {
  nn: number;
  slug: string;
  scope: string;
  queries_attempted: Array<{
    query: string;
    attempt: number;
    raw_results: number;
    kept: string[];
  }>;
  redo_count: number;
  redo_log: Array<{ attempt: number; reason: string; new_queries: string[] }>;
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

/** research-db/jev-log.json */
export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens: number; output_tokens: number };
  note?: string;
}
