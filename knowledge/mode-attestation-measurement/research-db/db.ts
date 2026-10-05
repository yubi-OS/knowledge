// research-db schema for knowledge/mode-attestation-measurement
//
// File -> interface mapping:
//   preflight.json            -> PreflightRecord
//   outline.json              -> OutlineRecord
//   archive.json              -> DugResult[] (JSON array)
//   digs/<NN>-<slug>.json     -> DigRecord (one file per subtopic)
//   jev-log.json              -> JevLogEntry[] (JSON array)

// archive.json: one entry per collected search result.
export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;          // jev noul probability
  decision: DecisionRecord;
  redo_of: number | null;         // index of superseded unweighted entry, if rescored
}

// Full record of one jev decision-model request (embedded in DugResult).
export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;                  // "clef"
  answer: object;                 // raw answer object as returned by /api/decide
  usage: { input_tokens: number | null; output_tokens: number | null };
  requested_at: string;
}

// digs/<NN>-<slug>.json: dig record for one subtopic.
export interface DigRecord {
  nn: number;
  slug: string;
  scope: string;
  queries_attempted: { query: string; attempt: number; raw_results: number | null; kept: number }[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];         // urls
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

// outline.json: topic decomposition plus the jev outline validation.
export interface OutlineRecord {
  topic: string;
  subtopics: { nn: number; slug: string; scope: string; seed_queries: string[] }[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, object>;
    usage: { input_tokens: number | null; output_tokens: number | null };
    dropped: number[];
    kept: number[];
  };
}

// jev-log.json: one entry per jev HTTP request.
export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string | null;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens: number | null; output_tokens: number | null };
  note?: string;
}

// preflight.json: endpoint health before the run.
export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: object; unresponsive_engines: string[] };
  decide: { url: string; model: string; probe_answer: string };
}
