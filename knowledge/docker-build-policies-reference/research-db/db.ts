// research-db type map for knowledge/docker-build-policies-reference
// File mapping:
//   preflight.json  -> PreflightRecord
//   outline.json    -> OutlineRecord
//   archive.json    -> ArchiveEntry[] (each entry = collected searXNG result + DecisionRecord)
//   digs/<NN>-<slug>.json -> DigRecord
//   jev-log.json    -> JevLogEntry[]

// archive.json: one entry per collected result (deduped by URL)
export interface DugResult {
  query: string;          // searXNG query the result came from
  title: string;
  url: string;
  snippet: string;        // result content as returned by searXNG
  collected_at: string;   // ISO 8601 UTC
  weight: number | null;  // jev noul probability; null = unweighted
  slug: string;           // subtopic slug the result backs
  redo_of: number | null; // index of superseded unweighted entry, else null
  decision: DecisionRecord | null;
}

// embedded in DugResult.decision; mirrors a /api/decide answer
export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: "clef";
  answer: { type: "noul"; noul: number } | { type: "score"; score: number; probabilities: Record<string, number>; confidence: number; legend: Record<string, string> };
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string;   // ISO 8601 UTC
}

// digs/<NN>-<slug>.json: per-subtopic dig record
export interface DigRecord {
  nn: string;             // "01".."08"
  slug: string;
  scope: string;
  queries_attempted: { query: string; attempt: number; raw_results: number; kept: number }[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[]; // URLs backing this doc
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

// outline.json
export interface OutlineRecord {
  topic: string;
  subtopics: { nn: string; slug: string; scope: string; seed_queries: string[] }[];
  validation: {
    metric: "score";
    criteria: string[];
    model: "clef";
    answers: Record<string, { score: number; probabilities: Record<string, number>; confidence: number; legend: Record<string, string> }>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[]; // nn values dropped (score 0)
    kept: string[];    // nn values kept
  };
}

// jev-log.json: one entry per jev HTTP request
export interface JevLogEntry {
  requested_at: string;
  endpoint: string;       // e.g. /api/decide
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: ("noul" | "score" | "choice")[];
  usage: { input_tokens: number; output_tokens: number };
}

// preflight.json
export interface PreflightRecord {
  date: string;           // YYYY-MM-DD
  searxng: { url: string; probe_results: string; unresponsive_engines: string[] };
  decide: { url: string; model: string; probe_answer: unknown };
}
