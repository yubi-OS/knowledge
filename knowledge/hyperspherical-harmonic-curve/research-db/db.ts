// research-db type map for knowledge/hyperspherical-harmonic-curve
//
// File -> interface mapping:
//   preflight.json          -> PreflightRecord
//   outline.json            -> OutlineRecord
//   archive.json            -> DugResult[]  (one entry per collected search result)
//   digs/<NN>-<slug>.json   -> DigRecord
//   jev-log.json            -> JevLogEntry[] (one entry per jev HTTP request)

/** research-db/preflight.json */
export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: { status: number; resultCount: number; probe_query: string };
    unresponsive_engines: string[];
  };
  decide: {
    url: string;
    model: string;
    probe_answer: {
      status: number;
      model: string;
      answers: Record<string, unknown>;
      usage: { input_tokens: number; output_tokens: number };
    };
  };
}

/** research-db/outline.json */
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

/** One collected search result in research-db/archive.json */
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

/** The jev decision backing a DugResult.weight */
export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: string;
  answer: {
    type: string;
    noul: number;
  };
  usage: { input_tokens: number | null; output_tokens: number | null };
  requested_at: string;
}

/** research-db/digs/<NN>-<slug>.json */
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

/** One entry in research-db/jev-log.json */
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
