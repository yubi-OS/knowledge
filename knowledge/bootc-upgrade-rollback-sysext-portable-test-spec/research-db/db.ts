// db.ts — TypeScript interfaces for the research-db files of
// knowledge/bootc-upgrade-rollback-sysext-portable-test-spec.
// File -> interface mapping:
//   preflight.json            -> PreflightRecord
//   outline.json              -> OutlineRecord
//   archive.json              -> DugResult[]
//   digs/<NN>-<slug>.json     -> DigRecord
//   jev-log.json              -> JevLogEntry[]

export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: number;
    unresponsive_engines: string[];
  };
  decide: {
    url: string;
    model: string;
    probe_answer: Record<string, unknown>;
  };
}

export interface Subtopic {
  nn: string;
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
  subtopics: Subtopic[];
  validation: {
    metric: string;
    criteria: string[];
    model: string;
    answers: Record<string, ScoreAnswer>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[];
    kept: string[];
  };
}

// archive.json: one entry per collected search result.
export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: "clef";
  answer: Record<string, unknown>;
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string;
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

export interface QueryAttempt {
  query: string;
  attempt: number;
  raw_results: number;
  kept: string[];
}

export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: QueryAttempt[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

// jev-log.json: one entry per jev HTTP request.
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
