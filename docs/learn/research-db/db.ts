// research-db type map for docs/learn (minted 2026-10-06)
// File -> interface mapping:
//   preflight.json          -> PreflightRecord
//   outline.json            -> OutlineRecord
//   archive.json            -> DugResult[]  (one entry per collected result)
//   digs/<NN>-<slug>.json   -> DigRecord
//   jev-log.json            -> JevLogEntry[]

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string };
  decide: { url: string; model: string; note: string };
}

export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string; // collected content, truncated to 190 chars at collection
  collected_at: string; // dig window midpoint 2026-10-06T09:02:00Z (approximate, +/-60s)
  weight: number | null; // jev noul probability; null would mean unweighted (never shipped)
  decision: DecisionRecord;
  redo_of: number | null; // index of a superseded unweighted entry; always null here (no redos)
}

export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string; // "clef" per schema; executed as typesafe/jev-1.13
  answer: object; // raw answer object from the decision model
  usage: { input_tokens: number; output_tokens: number; note?: string }; // batch-level when noted
  requested_at: string;
}

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
  internal_record?: boolean; // true when the subtopic was not dug per the DOCS brief
}

export interface OutlineRecord {
  topic: string;
  source_doc: { repo: string; path: string; url: string; bytes: number; fetched_at: string };
  subtopics: { nn: string; slug: string; scope: string; seed_queries: string[]; internal_record: boolean }[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    endpoint: string;
    note?: string;
    answers: Record<string, object>;
    usage: object;
    dropped: string[];
    kept: string[];
  };
}

export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens: number; output_tokens: number; cost?: number };
  label?: string;
}
