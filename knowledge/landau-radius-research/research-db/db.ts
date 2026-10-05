// db.ts - TypeScript interfaces for the landau-radius-research research-db.
// File -> interface map:
//   preflight.json -> PreflightRecord
//   outline.json   -> OutlineRecord
//   archive.json   -> DugResult[] (each carries a DecisionRecord)
//   digs/*.json    -> DigRecord
//   jev-log.json   -> JevLogEntry[]

// preflight.json: searXNG + /api/decide health check for this mint.
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
    probe_answer: number | null;
  };
}

// outline.json: the 8 subtopics, their seed queries, and the jev score validation.
export interface OutlineRecord {
  topic: string;
  subtopics: Array<{
    nn: number;
    slug: string;
    scope: string;
    seed_queries: string[];
    score: number;
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
}

// archive.json: one entry per collected search result, weighted by the noul metric.
export interface DugResult {
  slug: string;         // subtopic slug the result was collected for
  query: string;        // searXNG query that returned it
  attempt: number;      // 1 = original dig, 2 = redo
  title: string;
  url: string;
  snippet: string;
  collected_at: string; // ISO timestamp of the decision batch that weighted it
  weight: number | null; // noul probability; null only if the metric never returned
  decision: DecisionRecord;
  redo_of: number | null; // index of the superseded unweighted entry when rescored
}

// archive.json .decision: the full record of the noul decision that produced the weight.
export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: string; // "clef"
  answer: {
    type: string;
    noul: number;
  } | Record<string, unknown>;
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string;
}

// digs/<NN>-<slug>.json: per-doc dig record including redos.
export interface DigRecord {
  nn: number;
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
  results_kept: string[]; // URLs that survived dedupe into archive.json
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

// jev-log.json: one entry per jev HTTP request (probe, outline, weighting).
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
