// research-db/db.ts — TypeScript interfaces for the jev-orchestrator research database (schema v2).
// File -> interface mapping:
//   preflight.json      -> PreflightRecord
//   outline.json        -> OutlineRecord
//   archive.json        -> DugResult[] (one entry per collected search result)
//   digs/<NN>-<slug>.json -> DigRecord (one file per kept subtopic)
//   jev-log.json        -> JevLogEntry[] (one entry per jev /api/decide HTTP request)

export interface PreflightProbe {
  query: string;
  http_status: number;
  results_present: boolean;
  engines_observed: string[];
}

export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: PreflightProbe;
    unresponsive_engines: string[];
  };
  decide: {
    url: string;
    model: string;
    probe_answer: { type: string; noul: number };
  };
}

export interface ScoreValidationAnswer {
  score: number;
  probabilities: Record<string, number>;
  confidence: number;
  legend?: string[];
}

export interface OutlineSubtopic {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
  validation?: ScoreValidationAnswer;
}

export interface OutlineRecord {
  topic: string;
  subtopics: OutlineSubtopic[];
  validation: {
    metric: "score";
    criteria: string[];
    legend?: string[];
    model: string;
    answers: Record<string, ScoreValidationAnswer>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[];
    kept: string[];
  };
}

export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  answer: Record<string, unknown>;
  usage: { input_tokens: number; output_tokens: number } | null;
  requested_at: string | null;
}

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
  usage: { input_tokens: number; output_tokens: number } | null;
  note?: string;
}
