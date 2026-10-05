// research-db/db.ts
// Type interfaces for the entity-governance-legal research database (schema v2).
//
// File -> interface mapping:
//   preflight.json        -> PreflightRecord
//   outline.json          -> OutlineRecord
//   archive.json          -> DugResult[] (one entry per collected search result)
//   digs/<NN>-<slug>.json -> DigRecord (one per subtopic)
//   jev-log.json          -> JevLogEntry[] (one per jev HTTP request)

/** preflight.json */
export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: number;
    unresponsive_engines: Array<[string, string]>;
  };
  decide: {
    url: string;
    model: string;
    probe_answer: { type: string; noul: number };
  };
}

/** outline.json */
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
      score: number;
      probabilities: Record<string, number>;
      confidence: number;
      legend?: Record<string, string>;
      type?: string;
    }>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[];
    kept: string[];
  };
}

/** archive.json (array of DugResult) */
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

/** embedded decision record inside a DugResult */
export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  answer: object;
  usage: { input_tokens: number | null; output_tokens: number | null };
  requested_at: string;
}

/** digs/<NN>-<slug>.json */
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
    new_queries?: string[];
  }>;
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

/** jev-log.json (array of JevLogEntry) */
export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens: number | null; output_tokens: number | null } | null;
}
