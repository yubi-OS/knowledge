// db.ts - TypeScript interfaces for the research-db files in knowledge/covenant-conflict-policy/research-db/.
// File -> interface map:
//   preflight.json -> PreflightRecord
//   outline.json   -> OutlineRecord
//   archive.json   -> DugResult[]
//   digs/*.json    -> DigRecord
//   jev-log.json   -> JevLogEntry[]

/** research-db/preflight.json - environment probes taken before the mint. */
export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: { ok: boolean; status?: number; result_count?: number; error?: string };
    unresponsive_engines: string[];
  };
  decide: { url: string; model: string; probe_answer: unknown };
}

/** research-db/outline.json - decomposition and jev score validation of the outline. */
export interface OutlineRecord {
  topic: string;
  subtopics: { nn: number; slug: string; scope: string; seed_queries: string[] }[];
  validation: {
    metric: 'score';
    criteria: string[];
    model: string;
    answers: Record<string, { score: number; probabilities?: Record<string, number>; confidence?: number; legend?: Record<string, string>; instructions?: string }>;
    usage: { input_tokens: number; output_tokens: number } | null;
    dropped: number[];
    kept: number[];
  };
}

/** research-db/archive.json - one entry per collected search result, always carrying a jev weight. */
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

/** The jev decision record embedded in every DugResult. */
export interface DecisionRecord {
  type: 'noul';
  instructions: string;
  model: string;
  answer: { type: 'noul'; noul: number };
  usage: { input_tokens: number; output_tokens: number } | null;
  requested_at: string;
}

/** research-db/digs/<NN>-<slug>.json - per-subtopic dig provenance. */
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

/** research-db/jev-log.json - one entry per jev /api/decide HTTP request. */
export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens: number; output_tokens: number } | null;
  redo_note?: string;
}
