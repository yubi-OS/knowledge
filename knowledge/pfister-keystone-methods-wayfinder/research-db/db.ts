// research-db/db.ts — TypeScript interfaces for every file in this research-db.
//
// File -> interface mapping:
//   preflight.json          -> PreflightRecord
//   outline.json            -> OutlineRecord
//   archive.json            -> DugResult[] (array of DugResult)
//   digs/<NN>-<slug>.json   -> DigRecord
//   jev-log.json            -> JevLogEntry[]
//
// All JSON files are plain UTF-8. The archive holds one entry per collected
// result, each with its full noul decision record. Weights >= 0.5 are
// authoritative backing; < 0.5 is weak backing and the docs label it.

/** preflight.json */
export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: number | null;
    unresponsive_engines: [string, string][] | string[];
  };
  decide: {
    url: string;
    model: string | null;
    probe_answer: unknown;
  };
}

/** outline.json */
export interface OutlineRecord {
  topic: string;
  subtopics: {
    nn: string;
    slug: string;
    scope: string;
    seed_queries: string[];
  }[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, {
      type: string;
      score?: number;
      noul?: number;
      probabilities?: Record<string, number>;
      confidence?: number;
      legend?: Record<string, string>;
    }>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[];
    kept: string[];
  };
}

/** archive.json: one entry per collected search result */
export interface DugResult {
  nn: string;
  query: string;
  title: string | null;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord;
  redo_of: number | null;
}

/** the full record of one jev decision */
export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  answer: unknown;
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string;
}

/** digs/<NN>-<slug>.json */
export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: {
    query: string;
    attempt: number;
    raw_results: number;
    kept: number;
  }[];
  redo_count: number;
  redo_log: {
    attempt: number;
    reason: string;
    new_queries: string[];
  }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

/** jev-log.json: one entry per jev HTTP request */
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
