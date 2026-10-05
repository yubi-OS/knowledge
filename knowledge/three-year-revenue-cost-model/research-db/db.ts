// research-db type map: file -> interface
// preflight.json            -> PreflightRecord
// outline.json              -> OutlineRecord
// archive.json              -> DugResult[]
// digs/<NN>-<slug>.json     -> DigRecord
// jev-log.json              -> { note: string; entries: JevLogEntry[] }

export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null; // noul probability from the decision model
  decision: DecisionRecord;
  redo_of: number | null; // index of superseded unweighted entry when rescored
}

export interface DecisionRecord {
  type: 'noul' | 'score' | 'choice';
  instructions: string;
  model: 'clef';
  answer: unknown; // raw answer object from /api/decide (e.g. { type: 'noul', noul: number })
  usage: { input_tokens: number | null; output_tokens: number | null };
  requested_at: string;
}

export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: { query: string; attempt: number; raw_results: number; kept: number }[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[]; // URLs actually cited in the authored doc
  outcome: 'authored' | 'skipped';
  skip_reason?: string;
}

export interface OutlineRecord {
  topic: string;
  subtopics: { nn: string; slug: string; scope: string; seed_queries: string[] }[];
  validation: {
    metric: 'score';
    criteria: string[];
    model: string;
    answers: Record<string, { score: number; probabilities: Record<string, number>; confidence: number; legend: unknown }>;
    usage: unknown;
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
  usage: { input_tokens: number | null; output_tokens: number | null } | null;
  note?: string;
}

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: unknown; unresponsive_engines: string[] };
  decide: { url: string; model: string; probe_answer: string };
}
