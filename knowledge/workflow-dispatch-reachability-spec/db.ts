// research-db type map: file -> interface
// preflight.json          -> PreflightRecord
// outline.json            -> OutlineRecord
// archive.json            -> DugResult[]
// digs/<NN>-<slug>.json   -> DigRecord
// jev-log.json            -> JevLogEntry[]

// One collected searXNG result plus its weighting decision. Stored in archive.json.
export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord | null;
  redo_of: number | null;
}

// Full record of one clef decision on /api/decide. Embedded in DugResult.decision.
export interface DecisionRecord {
  type: 'noul' | 'score' | 'choice';
  instructions: string;
  model: string;
  answer: Record<string, unknown>;
  usage: { input_tokens: number | null; output_tokens: number | null };
  requested_at: string;
}

// Per-subtopic dig record. Stored in digs/<NN>-<slug>.json.
export interface DigRecord {
  nn: number;
  slug: string;
  scope: string;
  queries_attempted: { query: string; attempt: number; raw_results: number; kept: number }[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: 'authored' | 'skipped';
  skip_reason?: string;
}

// The validated outline. Stored in outline.json.
export interface OutlineRecord {
  topic: string;
  subtopics: { nn: number; slug: string; scope: string; seed_queries: string[] }[];
  validation: {
    metric: 'score';
    criteria: string[];
    model: string;
    answers: Record<string, Record<string, unknown>>;
    usage: { input_tokens: number | null; output_tokens: number | null };
    dropped: number[];
    kept: number[];
  };
}

// One jev HTTP request. Stored in jev-log.json.
export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens: number | null; output_tokens: number | null };
}

// Endpoint health probe. Stored in preflight.json.
export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: number; unresponsive_engines: unknown[] };
  decide: { url: string; model: string; probe_answer: Record<string, unknown> };
}

