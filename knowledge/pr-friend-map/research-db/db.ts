// research-db/db.ts - TypeScript interfaces matching every shape in this research-db.
// File -> interface mapping:
//   preflight.json        -> PreflightRecord
//   outline.json          -> OutlineRecord
//   archive.json          -> DugResult[] (the JSON file is a plain array)
//   digs/<NN>-<slug>.json -> DigRecord
//   jev-log.json          -> JevLogEntry[] (the JSON file is a plain array)

/** One search result collected from the searXNG dig endpoint, with its jev weighting decision. */
export interface DugResult {
  query: string; // the searXNG query that produced this result
  title: string;
  url: string;
  snippet: string; // content/snippet excerpt captured at dig time
  collected_at: string; // ISO 8601 UTC
  weight: number | null; // jev noul probability; null only if unscored (none in this corpus)
  decision: DecisionRecord;
  redo_of: number | null; // index of the superseded entry when a result was rescored
}

/** Full record of one jev /api/decide decision. */
export interface DecisionRecord {
  type: "noul"; // metric used for weighting
  instructions: string; // exact question text sent to the model
  model: "clef";
  answer: object; // raw answer object returned by /api/decide
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string; // ISO 8601 UTC
}

/** Per-doc dig record: what was searched, what was kept, whether a redo ran. */
export interface DigRecord {
  nn: string; // doc number, e.g. "01"
  slug: string; // doc slug, e.g. "readiness-gates"
  scope: string; // one-line scope from the outline
  queries_attempted: {
    query: string;
    attempt: number; // 1 = initial dig, 2+ = redo
    raw_results: number; // total results returned by the endpoint
    kept: { query: string; title: string; url: string; snippet: string }[];
  }[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[]; // urls kept for this doc
  outcome: "authored" | "skipped";
  skip_reason?: string; // present only when outcome === "skipped"
}

/** Outline plus its jev score validation. */
export interface OutlineRecord {
  topic: string;
  subtopics: { nn: string; slug: string; scope: string; seed_queries: string[] }[];
  validation: {
    metric: "score";
    criteria: string[]; // lowest-first criteria list
    model: string;
    answers: Record<
      string,
      { score: number; probabilities: Record<string, number>; confidence: number; legend: Record<string, string> }
    >;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[]; // nn values with score 0
    kept: string[]; // nn values kept for the dig
  };
}

/** One jev HTTP request, logged for audit. */
export interface JevLogEntry {
  requested_at: string; // ISO 8601 UTC
  endpoint: string; // e.g. "/api/decide"
  state: string; // the state string sent, here the corpus REF
  model: string; // "clef"
  n_questions: number;
  question_names: string[];
  metric_types: string[]; // e.g. ["noul"] or ["score"]
  usage: { input_tokens: number; output_tokens: number };
}

/** Preflight health check of both endpoints before the mint. */
export interface PreflightRecord {
  date: string; // YYYY-MM-DD
  searxng: {
    url: string;
    probe_results: number; // result count from the probe query
    unresponsive_engines: string[]; // engines that failed the probe (empty = all healthy)
  };
  decide: {
    url: string;
    model: string; // "clef"
    probe_answer: object; // raw probe response
  };
}
