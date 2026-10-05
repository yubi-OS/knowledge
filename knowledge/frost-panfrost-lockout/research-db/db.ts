// db.ts - TypeScript interfaces for the frost-panfrost-lockout research-db (schema v2).
// File mapping:
//   preflight.json          -> PreflightRecord
//   outline.json            -> OutlineRecord
//   archive.json            -> DugResult[] (one entry per collected result)
//   digs/<NN>-<slug>.json   -> DigRecord
//   jev-log.json            -> JevLogEntry[]

/** preflight.json - probe state for searXNG and the decide endpoint. */
export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: number;
    unresponsive_engines: [string, string][];
  };
  decide: {
    url: string;
    model: string;
    probe_answer: unknown;
  };
}

/** outline.json - the decomposed topic and its validation run. */
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
      score: number;
      legend: Record<string, string>;
      probabilities: Record<string, number>;
      confidence: number;
    }>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[];
    kept: string[];
  };
}

/** archive.json - one entry per collected search result with its weighting decision. */
export interface DugResult {
  nn: string;           // subtopic number this result belongs to
  query: string;        // query key (e.g. "01a") that produced the result
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null; // noul weight; null only if never scored
  decision: DecisionRecord;
  redo_of: number | null; // index of superseded unweighted entry, if rescored
}

/** The jev decision record attached to each DugResult. */
export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: "clef";
  answer: { type: "noul"; noul: number | null };
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string;
}

/** digs/<NN>-<slug>.json - per-subtopic dig provenance. */
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
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

/** jev-log.json - one entry per jev /api/decide HTTP request. */
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
