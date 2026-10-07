// db.ts - research-db schema v2 for the jev-corpus-unit-round knowledge corpus.
// File -> interface map:
//   preflight.json      -> PreflightRecord
//   outline.json        -> OutlineRecord
//   archive.json        -> DugResult[] (array of DugResult)
//   digs/<NN>-<slug>.json -> DigRecord (one per file)
//   jev-log.json        -> JevLogEntry[]

export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: string;
    unresponsive_engines: string[];
  };
  decide: {
    url: string;
    model: string;
    note?: string;
    probe_answer?: unknown;
  };
}

export interface OutlineSubtopic {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
  internal?: boolean;
}

export interface OutlineRecord {
  topic: string;
  source_doc: string;
  subtopics: OutlineSubtopic[];
  validation: {
    metric: 'score';
    criteria: string[];
    model: string;
    endpoint: string;
    answers: Record<string, unknown>; // raw score answer objects keyed t<NN>
    usage: { input_tokens: number; output_tokens: number; cost?: number } | null;
    dropped: string[];
    kept: string[];
  };
}

export interface DecisionRecord {
  type: 'noul' | 'score' | 'choice';
  instructions: string;
  model: string;
  answer: unknown; // raw answer object, e.g. {type:'noul', noul: 0.87, ...}
  usage: { input_tokens: number; output_tokens: number } | null;
  requested_at: string;
}

export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord | null;
  redo_of: number | null;
  doc_nn: string;
  doc_slug: string;
}

export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: { query: string; attempt: number; raw_results: number; kept: number }[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: 'authored' | 'skipped';
  skip_reason?: string;
  note?: string; // present on internal-record subtopics that skipped the dig
}

export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens: number; output_tokens: number; cost?: number } | null;
  http_status: number;
}
