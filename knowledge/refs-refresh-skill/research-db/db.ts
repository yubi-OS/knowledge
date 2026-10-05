// research-db type map: file -> interface
// preflight.json      -> PreflightRecord
// outline.json        -> OutlineRecord
// archive.json        -> DugResult[] (one entry per collected search result)
// digs/<NN>-<slug>.json -> DigRecord (one file per subtopic dig)
// jev-log.json        -> JevLogEntry[] (one entry per successful jev /api/decide request)

// One collected search result from the searXNG dig, with its weighting decision.
export interface DugResult {
  query: string;            // searXNG query that returned this result
  title: string;
  url: string;
  snippet: string;          // result content snippet as returned by the engine
  collected_at: string;     // ISO 8601 UTC timestamp of the dig wave
  weight: number | null;    // jev noul probability; null only if unscored
  decision: DecisionRecord; // the decision-model record that produced the weight
  redo_of: string | null;   // "redo1"/"redo2" when the result came from a redo dig wave, else null
}

// The full decision-model record stored beside every weight.
export interface DecisionRecord {
  type: "noul";             // metric type (true = primary/official source worth citing)
  instructions: string;     // exact instruction text sent to the model
  model: string;            // decision model id, e.g. "clef"
  answer: unknown;          // raw answer object as returned by /api/decide
  usage: Usage;             // usage tokens of the request that produced this answer
  requested_at: string | null; // ISO 8601 UTC timestamp of that request
}

export interface Usage {
  input_tokens: number | null;
  output_tokens: number | null;
}

// One dig record per subtopic: every query attempt, redos, and the outcome.
export interface DigRecord {
  nn: number;
  slug: string;
  scope: string;            // one-line scope of the subtopic doc
  queries_attempted: QueryAttempt[];
  redo_count: number;       // 0, 1, or 2 (2 = max per the REDO RULE)
  redo_log: RedoEntry[];
  results_kept: string[];   // urls of results scoring >= 0.5 (primary sources)
  outcome: "authored" | "skipped";
  skip_reason?: string;     // present when outcome is "skipped"
}

export interface QueryAttempt {
  query: string;
  attempt: number;          // 1 = initial dig, 2 = first redo, 3 = second redo
  raw_results: number;      // results returned by the engine
  kept: number;             // results kept (top 6 per query)
}

export interface RedoEntry {
  attempt: number;
  reason: string;           // why the previous dig was judged thin
  new_queries: string[];    // the replacement queries used for this redo
}

// outline.json: the decomposition plus its validation record.
export interface OutlineRecord {
  topic: string;
  subtopics: Subtopic[];
  validation: {
    metric: "score";
    criteria: string[];     // ordered criteria, lowest-first
    model: string;
    answers: Record<string, {
      score: number;
      probabilities: Record<string, number>;
      confidence: number;
      legend: Record<string, string>;
    }>;
    usage: Usage;
    dropped: string[];      // nn values dropped at validation (score 0)
    kept: string[];         // nn values kept for digging
  };
}

export interface Subtopic {
  nn: number;
  slug: string;
  scope: string;
  seed_queries: string[];   // includes redo replacement queries
}

// preflight.json: endpoint health recorded before any dig.
export interface PreflightRecord {
  date: string;             // YYYY-MM-DD
  searxng: {
    url: string;
    probe_results: string;  // human-readable probe outcome
    unresponsive_engines: string[];
  };
  decide: {
    url: string;
    model: string;
    probe_answer: string;
  };
}

// jev-log.json: one entry per successful jev /api/decide request.
export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;            // the state field sent to /api/decide
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];   // one per question ("score" or "noul")
  usage: Usage;
  note?: string;            // present only for the reconstructed lost-request entry
}
