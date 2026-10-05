// research-db/db.ts - TypeScript interfaces for every file in research-db/.
//
// File -> interface mapping:
//   preflight.json  -> PreflightRecord
//   outline.json    -> OutlineRecord
//   archive.json    -> DugResult[] (one entry per collected search result)
//   digs/*.json     -> DigRecord (one per subtopic)
//   jev-log.json    -> JevLogEntry[] (one entry per jev HTTP request)

export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: "clef";
  answer: Record<string, unknown>; // raw answer object, e.g. { type: "noul", noul: 0.8919 }
  usage: { input_tokens: number; output_tokens: number } | null;
  requested_at: string;
}

export interface DugResult {
  nn: string;
  slug: string;
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null; // null until weighted; backfilled from decision.answer.noul
  decision: DecisionRecord | null;
  redo_of: number | null; // index of superseded entry when a result was rescored
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
}

export interface OutlineRecord {
  topic: string;
  subtopics: { nn: string; slug: string; scope: string; seed_queries: string[] }[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, { score: number; probabilities: number[] | null; confidence: number | null; legend: unknown }>;
    usage: { input_tokens: number; output_tokens: number } | null;
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
  usage: { input_tokens: number; output_tokens: number };
}

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: number; unresponsive_engines: string[] };
  decide: { url: string; model: string; probe_answer: unknown };
}
