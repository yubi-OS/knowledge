// research-db type map for skills/negative-skill-space/
//
// preflight.json            -> PreflightRecord
// outline.json              -> OutlineRecord (subtopics: OutlineSubtopic[], validation: OutlineValidation)
// archive.json              -> DugResult[] (decision: DecisionRecord)
// digs/<NN>-<slug>.json     -> DigRecord
// jev-log.json              -> JevLogEntry[]

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
  dig_mode: "web" | "internal-record";
}

export interface OutlineValidation {
  metric: "score";
  criteria: string[];
  model: string;
  endpoint: string;
  requested_at: string;
  answers: Record<string, {
    type: string;
    score: number;
    legend: Record<string, string>;
    probabilities: Record<string, number>;
    confidence: number;
  }>;
  usage: { input_tokens: number; output_tokens: number };
  verdict_rule: string;
  dropped: string[];
  drop_reasons: Record<string, string>;
  kept: string[];
}

export interface OutlineRecord {
  topic: string;
  ground_source: {
    url: string;
    bytes: number;
    fetched_at: string;
    user_agent: string;
  };
  subtopics: OutlineSubtopic[];
  validation: OutlineValidation;
}

export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  answer: unknown;
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
  decision: DecisionRecord;
  redo_of: number | null;
  nn: string;
  slug: string;
  q: number;
  attempt: number;
}

export interface DigQueryAttempt {
  query: string;
  attempt: number;
  raw_results: number;
  kept: number;
}

export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: DigQueryAttempt[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
  note?: string;
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
}
