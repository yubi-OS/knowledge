// research-db/db.ts - TypeScript interfaces for the kvm-arm-nested-virtualization research DB.
// File -> interface mapping:
//   preflight.json          -> PreflightRecord
//   outline.json            -> OutlineRecord
//   archive.json            -> DugResult[] (one entry per collected search result)
//   digs/<NN>-<slug>.json   -> DigRecord
//   jev-log.json            -> JevLogEntry[]
//
// Note: the decide API reports usage tokens at request (batch) granularity; in
// DugResult.decision.usage the batch usage is divided evenly across the batch's
// questions. In JevLogEntry.usage the usage is the full request usage.

/** research-db/preflight.json */
export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: Record<string, number | string>;
    unresponsive_engines: string[];
  };
  decide: {
    url: string;
    model: string;
    probe_answer: unknown;
  };
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
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, {
      score: number | null;
      probabilities: Record<string, number> | null;
      confidence: number | null;
      legend: Record<string, string> | null;
    }>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[];
    kept: string[];
  };
}

/** research-db/archive.json - array of DugResult, one per collected result */
export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  /** noul probability; null only if the result was never successfully weighted */
  weight: number | null;
  decision: DecisionRecord;
  /** index of the superseded unweighted entry when a result was rescored; null otherwise */
  redo_of: number | null;
}

/** Full record of one jev decision */
export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  answer: unknown;
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string | null;
}

/** research-db/digs/<NN>-<slug>.json */
export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: Array<{
    query: string;
    attempt: number;
    raw_results: number;
    kept: number;
  }>;
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

/** research-db/jev-log.json - one entry per jev HTTP request */
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
