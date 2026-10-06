// research-db/db.ts - TypeScript interfaces for the chromium-overlay-ship research database.
// File -> interface map:
//   preflight.json        -> PreflightRecord
//   outline.json          -> OutlineRecord
//   archive.json          -> DugResult[] (JSON array)
//   digs/<NN>-<slug>.json -> DigRecord
//   jev-log.json          -> JevLogEntry[] (JSON array)

// preflight.json
export interface PreflightRecord {
  date: string;                       // ISO date of the mint
  searxng: {
    url: string;                      // searXNG webhook endpoint
    probe_results: string;            // probe outcome or "campaign preflight healthy (orchestrator)"
    unresponsive_engines?: string[];  // engines that failed the probe, if any
  };
  decide: {
    url: string;                      // decision endpoint actually used
    model: string;                    // e.g. typesafe/jev-1.13
    probe_answer?: unknown;           // probe response, if agent-side probe ran
    note?: string;                    // free-form note (e.g. orchestrator-side preflight)
  };
}

// outline.json
export interface OutlineRecord {
  topic: string;
  subtopics: {
    nn: string;                       // zero-padded order number
    slug: string;                     // doc slug
    scope: string;                    // one-line scope
    seed_queries: string[];           // 2 seed web-search queries (empty for internal-record subtopics)
  }[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    endpoint?: string;                // decision endpoint used
    answers: Record<string, {
      score: number;
      probabilities: Record<string, number>;
      confidence: number;
      legend: Record<string, string>;
    }>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[];                // nn values dropped at validation
    kept: string[];                   // nn values kept
    drop_reason?: Record<string, string>;
  };
}

// archive.json entries (one per collected dig result)
export interface DugResult {
  query: string;                      // the searXNG query that produced the result
  title: string;
  url: string;
  snippet: string;                    // result content excerpt
  collected_at: string;               // ISO timestamp
  weight: number | null;              // noul probability of "worth citing"; null = unweighted
  decision: DecisionRecord | null;
  redo_of: number | null;             // index of the superseded unweighted entry, when rescored
}

export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;                      // decision model id (clef / typesafe/jev-1.13-*)
  answer: unknown;                    // raw answer object as returned (includes noul/score/probabilities)
  usage: { input_tokens: number | null; output_tokens: number | null };
  requested_at: string;
}

// digs/<NN>-<slug>.json
export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: {
    query: string;
    attempt: number;                  // 1 = first try, 2+ = redos
    raw_results: number;              // results returned by searXNG
    kept: number;                     // results kept (top N per query)
  }[];
  redo_count: number;
  redo_log: {
    attempt: number;
    reason: string;
    new_queries: string[];
  }[];
  results_kept: string[];             // urls of results with weight >= 0.5 used in the doc
  outcome: "authored" | "skipped";
  skip_reason?: string | null;
  note?: string;                      // e.g. "internal-record subtopic, no dig"
}

// jev-log.json entries (one per jev HTTP request)
export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;                      // jev state name (corpus name)
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: ("noul" | "score" | "choice")[];
  usage: { input_tokens: number | null; output_tokens: number | null };
  note?: string;                      // e.g. discarded-run explanation, redo marker
}
