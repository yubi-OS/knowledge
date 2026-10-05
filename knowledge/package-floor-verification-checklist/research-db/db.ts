// db.ts - TypeScript interfaces for the package-floor-verification-checklist research-db.
// File mapping:
//   research-db/preflight.json            -> PreflightRecord
//   research-db/outline.json              -> OutlineRecord
//   research-db/archive.json              -> DugResult[] (JSON array)
//   research-db/digs/<NN>-<slug>.json     -> DigRecord
//   research-db/jev-log.json              -> JevLogEntry[] (JSON array)

// PreflightRecord: health probe of the two services used by the mint.
export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: number;
    probe_query?: string;
    unresponsive_engines: string[];
  };
  decide: {
    url: string;
    model: string;
    probe_answer: unknown;
  };
}

// OutlineRecord: topic decomposition + jev score validation of every subtopic.
export interface OutlineRecord {
  topic: string;
  subtopics: {
    nn: number;
    slug: string;
    scope: string;
    seed_queries: string[];
  }[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    requested_at: string;
    answers: Record<string, {
      type: "score";
      score: number;
      probabilities: Record<string, number>;
      confidence: number;
      legend: Record<string, string>;
    }>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: number[];
    kept: number[];
  };
}

// DecisionRecord: the full raw record of one jev decision-model call.
export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  answer: unknown;
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string;
}

// DugResult: one collected search result with its jev weight and decision record.
export interface DugResult {
  nn: number;
  slug: string;
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord;
  redo_of: number | null;
}

// DigRecord: per-subtopic dig trace: queries attempted, redos, outcome.
export interface DigRecord {
  nn: number;
  slug: string;
  scope: string;
  queries_attempted: {
    query: string;
    attempt: number;
    raw_results: number;
    kept: string[];
  }[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

// JevLogEntry: one jev HTTP request with usage tokens.
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
