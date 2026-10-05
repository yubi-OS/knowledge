// research-db schema v2: file -> interface mapping for the systemd-v262-refresh corpus.
// preflight.json -> PreflightRecord
// outline.json -> OutlineRecord
// archive.json -> DugResult[]
// digs/<NN>-<slug>.json -> DigRecord
// jev-log.json -> JevLogEntry[]
// All JSON is plain UTF-8; no base64 content anywhere.

export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: number | null;
    unresponsive_engines: string[];
  };
  decide: {
    url: string;
    model: string | null;
    probe_answer: unknown;
  };
}

export interface OutlineSubtopic {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
}

export interface OutlineValidationAnswer {
  type?: string;
  score: number;
  probabilities: Record<string, number>;
  confidence: number;
  legend?: unknown;
}

export interface OutlineRecord {
  topic: string;
  subtopics: OutlineSubtopic[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, OutlineValidationAnswer>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[];
    kept: string[];
  };
}

export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: string;
  answer: unknown; // raw clef answer object, e.g. { type: "noul", noul: 0.92 }
  usage: { input_tokens: number | null; output_tokens: number | null };
  requested_at: string;
}

export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null; // jev noul probability; null only if scoring failed after redos
  decision: DecisionRecord | null;
  redo_of: number | null; // index of the superseded entry when a result was rescored
}

export interface DigQueryAttempt {
  query: string;
  attempt: number;
  raw_results: string;
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
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
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
