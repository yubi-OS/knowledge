// db.ts - TypeScript interfaces for the v261-base-image-bump research-db files.
// File mapping: preflight.json -> PreflightRecord, outline.json -> OutlineRecord,
// archive.json -> DugResult[], digs/<NN>-<slug>.json -> DigRecord, jev-log.json -> JevLogEntry[].

export interface DecisionRecord {
  type: 'noul' | 'score' | 'choice';
  instructions: string;
  model: string; // 'clef'
  answer: object; // raw answer object incl. probabilities/legend/confidence
  usage: { input_tokens: number | null; output_tokens: number | null };
  requested_at: string;
}

export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null; // noul probability
  decision: DecisionRecord;
  redo_of: number | null; // index of superseded entry on rescore
}

export interface QueryAttempt {
  query: string;
  attempt: number;
  raw_results: number;
  kept: number;
}

export interface RedoLogEntry {
  attempt: number;
  reason: string;
  new_queries: string[];
}

export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: QueryAttempt[];
  redo_count: number;
  redo_log: RedoLogEntry[];
  results_kept: string[];
  outcome: 'authored' | 'skipped';
  skip_reason?: string;
}

export interface SubtopicSpec {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
}

export interface OutlineRecord {
  topic: string;
  subtopics: SubtopicSpec[];
  validation: {
    metric: 'score';
    criteria: string[];
    model: string;
    answers: Record<string, object>;
    usage: object | null;
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
  usage: { input_tokens: number | null; output_tokens: number | null };
}

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: number | null; unresponsive_engines: string[] };
  decide: { url: string; model: string; probe_answer: object };
}
