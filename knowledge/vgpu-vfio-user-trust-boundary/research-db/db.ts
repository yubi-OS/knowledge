// db.ts — TypeScript interfaces for the research-db of the vgpu-vfio-user-trust-boundary corpus.
//
// File -> interface mapping:
//   research-db/preflight.json            -> PreflightRecord
//   research-db/outline.json              -> OutlineRecord
//   research-db/archive.json              -> DugResult[] (JSON array of DugResult)
//   research-db/digs/<NN>-<slug>.json     -> DigRecord
//   research-db/jev-log.json              -> JevLogEntry[] (JSON array of JevLogEntry)

export interface DecisionRecord {
  type: "noul" | "score";
  instructions: string;
  model: "clef";
  answer: Record<string, unknown> | null;
  usage: { input_tokens: number | null; output_tokens: number | null } | null;
  requested_at: string | null;
}

// One collected searXNG result, one entry per element of archive.json.
// weight is the jev noul probability; >= 0.5 counts as authoritative backing.
// redo_of carries the archive index of the superseded unweighted entry when rescored.
export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord;
  redo_of: number | null;
  nn: string;   // owning subtopic number (mint metadata)
  slug: string; // owning subtopic slug (mint metadata)
}

// One dig, one file under research-db/digs/.
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

// outline.json.
export interface OutlineRecord {
  topic: string;
  subtopics: { nn: string; slug: string; scope: string; seed_queries: string[] }[];
  validation: {
    metric: "score";
    criteria: string[];
    model: "clef";
    answers: Record<string, { score: number | null; probabilities: unknown; confidence: unknown; legend: unknown }>;
    usage: Record<string, unknown>;
    dropped: string[];
    kept: string[];
  };
}

// One jev HTTP request, one entry per element of jev-log.json.
export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: "clef";
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens: number | null; output_tokens: number | null };
}

// preflight.json.
export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: number; unresponsive_engines: string[] };
  decide: { url: string; model: string; probe_answer: unknown };
}
