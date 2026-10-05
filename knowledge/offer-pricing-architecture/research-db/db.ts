// research-db type map for knowledge/offer-pricing-architecture
// file -> interface mapping:
//   research-db/archive.json      -> DugResult[]
//   research-db/digs/<NN>-<slug>.json -> DigRecord
//   research-db/outline.json      -> OutlineRecord
//   research-db/jev-log.json      -> JevLogEntry[]
//   research-db/preflight.json    -> PreflightRecord

// archive.json entries: one per collected search result, with its jev weighting decision
export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord;
  redo_of: number | null;
}

// the jev decision stored per result (noul weighting) or per outline subtopic (score)
export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  answer: Record<string, unknown>;
  usage: { input_tokens: number | null; output_tokens: number | null };
  requested_at: string;
}

// digs/<NN>-<slug>.json: per-subtopic dig record including redo history
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

// outline.json: decomposed subtopics plus the jev score validation of the outline
export interface OutlineRecord {
  topic: string;
  subtopics: { nn: string; slug: string; scope: string; seed_queries: string[] }[];
  validation: {
    metric: string;
    criteria: string[];
    model: string;
    answers: Record<string, { score: number; probabilities: Record<string, number>; confidence: number; legend: Record<string, string> }>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[];
    kept: string[];
  };
}

// jev-log.json: one entry per jev HTTP request
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

// preflight.json: endpoint health probes taken before the mint
export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: number; unresponsive_engines: string[] };
  decide: { url: string; model: string; probe_answer: number };
}
