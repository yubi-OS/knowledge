// research-db type map for knowledge/spherical-defocus-g1 (schema v2)
//
// file -> interface:
//   preflight.json  -> PreflightRecord
//   outline.json    -> OutlineRecord
//   archive.json    -> DugResult[]  (one entry per collected dig result)
//   digs/NN-slug.json -> DigRecord
//   jev-log.json    -> JevLogEntry[] (one entry per jev HTTP request)

// preflight.json
export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: number;
    unresponsive_engines: [string, string][];
    engines_returned: string[];
  };
  decide: {
    url: string;
    model: string;
    probe_answer: unknown; // raw /api/decide response object
  };
}

// outline.json
export interface OutlineRecord {
  topic: string;
  subtopics: {
    nn: string;
    slug: string;
    scope: string;
    seed_queries: [string, string];
  }[];
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

// archive.json - one entry per collected result
export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord | null;
  redo_of: number | null;
  doc_nn: string;
  doc_slug: string;
}

// embedded decision record (full jev decision, stored per result)
export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: string;
  answer: unknown; // raw answer object incl. noul probability + legend + confidence
  usage: { input_tokens: number; output_tokens: number } | null;
  requested_at: string;
}

// digs/NN-slug.json - one record per doc dig
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

// jev-log.json - one entry per jev HTTP request
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
