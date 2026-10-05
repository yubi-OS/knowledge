// research-db/db.ts - TypeScript interfaces for every file in research-db/
// Mapping file -> interface:
//   preflight.json            -> PreflightRecord
//   outline.json              -> OutlineRecord
//   archive.json              -> DugResult[] (JSON array of DugResult)
//   digs/<NN>-<slug>.json     -> DigRecord
//   jev-log.json              -> JevLogEntry[] (JSON array of JevLogEntry)

export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: "clef";
  answer: object; // raw answer object as returned by /api/decide (e.g. { type: "noul", noul: 0.8982 })
  usage: { input_tokens: number; output_tokens: number } | null;
  requested_at: string; // ISO 8601
}

export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null; // noul probability; null only if never scored (mint rule: shipped archive entries must be non-null)
  decision: DecisionRecord | null;
  redo_of: number | null; // index of the superseded unweighted entry when a result was rescored
}

export interface DigQueryAttempt {
  query: string;
  attempt: number;
  raw_results: number;
  kept: number;
}

export interface DigRedoEntry {
  attempt: number;
  reason: string;
  new_queries: string[];
}

export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: DigQueryAttempt[];
  redo_count: number;
  redo_log: DigRedoEntry[];
  results_kept: number[]; // indices into archive.json
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

export interface OutlineSubtopic {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
}

export interface OutlineValidation {
  metric: "score";
  criteria: string[];
  model: string;
  answers: Record<string, { score: number; probabilities: object; confidence: number; legend: object; type: string }>;
  usage: { input_tokens: number; output_tokens: number } | null;
}

export interface OutlineRecord {
  topic: string;
  subtopics: OutlineSubtopic[];
  validation: OutlineValidation;
  dropped: string[];
  kept: string[];
}

export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: object;
    unresponsive_engines: string[];
  };
  decide: {
    url: string;
    model: string;
    probe_answer: object | null;
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
