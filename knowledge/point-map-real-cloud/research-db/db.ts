// research-db/db.ts - TypeScript interfaces for the point-map-real-cloud research DB.
// File -> interface mapping:
//   preflight.json        -> PreflightRecord
//   outline.json          -> OutlineRecord
//   archive.json          -> DugResult[] (a JSON array of these)
//   digs/NN-slug.json     -> DigRecord
//   jev-log.json          -> JevLogEntry[] (a JSON array of these)

// preflight.json: endpoint health probes taken before any dig ran.
export interface PreflightRecord {
  date: string; // mint date, ISO
  searxng: {
    url: string;
    probe_results: { http_status: number; probe_query: string; n_results: number; probed_at: string };
    unresponsive_engines: [string, string][]; // [engine, status] pairs as reported by searXNG
  };
  decide: {
    url: string;
    model: string;
    probe_answer: { type: string; noul: number };
    probe_usage: { input_tokens: number; output_tokens: number };
    probed_at: string;
  };
}

// outline.json: the doc outline plus the full jev score validation.
export interface OutlineRecord {
  topic: string;
  subtopics: {
    nn: number;
    slug: string;
    scope: string;
    seed_queries: string[];
  }[];
  validation: {
    metric: "score";
    criteria: string[]; // lowest-first
    model: string;
    answers: Record<string, {
      score: number;
      probabilities: Record<string, number>;
      confidence: number;
      legend: Record<string, string>;
    }>;
    usage: { input_tokens: number; output_tokens: number };
    requested_at: string;
    dropped: number[]; // nn values dropped by validation
    kept: number[]; // nn values kept
  };
}

// archive.json: every result collected by the dig, with its jev decision.
export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null; // the noul probability; null only if it could not be scored
  decision: DecisionRecord;
  redo_of: number | null; // index of a superseded unweighted entry when a result was rescored
}

// The per-result decision record stored inside each DugResult.
export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: string; // "clef"
  answer: { type: "noul"; noul: number }; // raw answer object as returned by /api/decide
  usage: { input_tokens: number; output_tokens: number }; // batch usage attributed per result
  requested_at: string;
}

// digs/NN-slug.json: one record per authored or skipped doc.
export interface DigRecord {
  nn: number;
  slug: string;
  scope: string;
  queries_attempted: {
    query: string;
    attempt: number; // 1 on the first pass, incremented per redo
    raw_results: { title: string; url: string; snippet: string }[];
    kept: string[]; // urls kept from this query
  }[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[]; // all urls carried forward for this doc
  outcome: "authored" | "skipped";
  skip_reason?: string; // present only when outcome is "skipped"
}

// jev-log.json: one entry per HTTP request to /api/decide (including probes and failed attempts).
export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens: number; output_tokens: number };
  failed?: boolean; // present on entries for failed attempts (usage is zeroed)
}
