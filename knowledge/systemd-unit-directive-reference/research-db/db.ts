// research-db type map for knowledge/systemd-unit-directive-reference
// File -> interface mapping:
//   preflight.json        -> PreflightRecord
//   outline.json          -> OutlineRecord
//   archive.json          -> DugResult[]  (flat array, one entry per collected result)
//   digs/<NN>-<slug>.json -> DigRecord
//   jev-log.json          -> JevLogEntry[] (flat array, one entry per jev HTTP request)

/** preflight.json — health probe of the two mint services. */
export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: number;
    probe_query?: string;
    unresponsive_engines: string[];
  };
  decide: {
    url: string;
    model: string;
    probe_answer: unknown;
    probe_note?: string;
  };
}

/** outline.json — decomposed subtopics plus the jev score validation. */
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
      legend?: Record<string, string>;
    }>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[];
    kept: string[];
    notes?: string;
  };
}

/** One searXNG result as collected and jev-weighted (noul). */
export interface DugResult {
  nn: string;            // outline subtopic number
  slug: string;          // outline subtopic slug
  query: string;         // the dig query that produced this result
  title: string;
  url: string;
  snippet: string;
  collected_at: string;  // ISO 8601 UTC
  weight: number | null; // noul probability of "authoritative source"
  decision: DecisionRecord | null;
  redo_of: string | null; // index of superseded entry when rescored
}

/** The full jev decision record backing one weight. */
export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  answer: unknown; // raw answer object from /api/decide
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string;
}

/** digs/<NN>-<slug>.json — per-subtopic dig trail. */
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

/** jev-log.json — one entry per jev HTTP request. */
export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens: number; output_tokens: number };
  note?: string; // provenance for retroactively logged or retried calls
}
