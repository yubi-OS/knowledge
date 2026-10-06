// db.ts - TypeScript interfaces for the steady-orbit-systems research-db (schema v2).
// File -> interface mapping:
//   research-db/preflight.json        -> PreflightRecord
//   research-db/outline.json          -> OutlineRecord
//   research-db/archive.json          -> DugResult[] (one entry per collected result)
//   research-db/digs/<NN>-<slug>.json -> DigRecord
//   research-db/jev-log.json          -> JevLogEntry[] (one entry per jev HTTP request)

// archive.json: one entry per collected result (searXNG dig results AND direct
// grounding fetches; grounding fetches carry query "direct-fetch (grounding layer)").
export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  /** noul probability from /api/decide; never null in this corpus (all results weighted) */
  weight: number | null;
  decision: DecisionRecord;
  /** index of the superseded unweighted entry when a result was rescored; null when fresh */
  redo_of: number | null;
}

// A single clef decision's full record (stored inside DugResult.decision).
export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  /** raw answer object as returned by /api/decide (value, probabilities, confidence, legend) */
  answer: Record<string, unknown>;
  usage: { input_tokens: number | null; output_tokens: number | null };
  requested_at: string;
}

// digs/<NN>-<slug>.json: per-subtopic dig record.
export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: { query: string; attempt: number; raw_results: number; kept: number }[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

// outline.json: the decomposed outline plus the single score-metric validation request.
export interface OutlineRecord {
  topic: string;
  subtopics: { nn: string; slug: string; scope: string; seed_queries: string[] }[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, { score: number; probabilities: Record<string, number>; confidence: number; legend: Record<string, string> }>;
    usage: { input_tokens?: number; output_tokens?: number };
    dropped: string[];
    kept: string[];
  };
}

// jev-log.json: one entry per jev HTTP request (outline validation + noul weighting batches).
export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: ("noul" | "score" | "choice")[];
  usage: { input_tokens: number | null; output_tokens: number | null };
}

// preflight.json: endpoint health before the mint began.
export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: Record<string, number>;
    unresponsive_engines: string[];
  };
  decide: {
    url: string;
    model: string;
    probe_answer: string;
  };
}
