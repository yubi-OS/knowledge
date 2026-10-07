// research-db type map: file -> interface
// preflight.json  -> PreflightRecord
// outline.json    -> OutlineRecord
// archive.json    -> DugResult[] (one entry per collected search result)
// digs/NN-slug.json -> DigRecord (one per subtopic)
// jev-log.json    -> JevLogEntry[] (one per jev HTTP request)

export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string; // "clef" (typesafe/jev-1.13)
  answer: unknown; // raw answer object, e.g. {"type":"noul","noul":0.61}
  usage: { input_tokens: number; output_tokens: number } | null;
  requested_at: string | null;
}

export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null; // = answer.noul when present
  decision: DecisionRecord;
  redo_of: number | null; // index of a superseded unweighted entry, else null
}

export interface QueryAttempt {
  query: string;
  attempt: number;
  raw_results: number;
  kept: number;
}

export interface DigRecord {
  nn: string; // "01".."09"
  slug: string;
  scope: string;
  queries_attempted: QueryAttempt[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[]; // urls
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

export interface OutlineRecord {
  topic: string;
  source_doc: string;
  subtopics: { nn: string; slug: string; scope: string; seed_queries: string[] }[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    endpoint: string;
    answers: Record<string, { score: number; probabilities: Record<string, number>; confidence: number; legend?: Record<string, string> }>;
    usage: { input_tokens: number; output_tokens: number; cost: number };
    request_id: string;
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
  metric_types: ("score" | "noul" | "choice")[];
  usage: { input_tokens: number; output_tokens: number } | null;
}

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string; unresponsive_engines: string[] };
  decide: { url: string; model: string; probe_answer: string };
}
