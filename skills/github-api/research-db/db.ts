// research-db schema v2 type map for the skills/github-api corpus (yubi-OS/knowledge)
// File -> interface mapping:
//   preflight.json        -> PreflightRecord
//   outline.json          -> OutlineRecord
//   archive.json          -> DugResult[] (the file is a JSON array of DugResult)
//   digs/<NN>-<slug>.json -> DigRecord
//   jev-log.json          -> JevLogEntry[]

export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: "clef";
  answer: unknown; // raw decision-model answer object, e.g. { type: "noul", noul: 0.97 }
  usage: { input_tokens: number | null; output_tokens: number | null };
  requested_at: string;
}

export interface DugResult {
  query: string;
  title: string | null;
  url: string | null;
  snippet: string | null;
  collected_at: string | null;
  weight: number | null; // jev noul probability; null means unweighted (must not ship)
  decision: DecisionRecord;
  redo_of: number | null; // index of the superseded unweighted entry when a result was rescored
}

export interface QueryAttempt {
  query: string;
  attempt: number; // 1 = initial dig, 2+ = redo round
  raw_results: number;
  kept: number;
}

export interface RedoLogEntry {
  attempt: number;
  reason: string;
  new_queries: string[];
}

export interface DigRecord {
  nn: number;
  slug: string;
  scope: string;
  queries_attempted: QueryAttempt[];
  redo_count: number;
  redo_log: RedoLogEntry[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
  note?: string;
}

export interface SubtopicSpec {
  nn: number;
  slug: string;
  scope: string;
  seed_queries: string[];
}

export interface ScoreAnswer {
  score: number;
  probabilities: Record<string, number>;
  confidence: number;
  legend: Record<string, string>;
}

export interface OutlineRecord {
  topic: string;
  subtopics: SubtopicSpec[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, ScoreAnswer>;
    usage: unknown;
    dropped: number[];
    kept: number[];
    note?: string;
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
  note?: string;
}

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string; unresponsive_engines: unknown[] };
  decide: { url: string; model: string; probe_answer: string };
}
