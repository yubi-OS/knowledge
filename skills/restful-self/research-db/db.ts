// research-db schema v2 interfaces for the restful-self knowledge corpus.
// File -> interface mapping:
//   preflight.json  -> PreflightRecord
//   outline.json    -> OutlineRecord
//   archive.json    -> { topic, ground_source, entries: DugResult[] }
//   digs/*.json     -> DigRecord
//   jev-log.json    -> JevLogEntry[]
//
// Decision records store the raw answer object as returned by the decision
// model. For the noul metric the answer shape is {"type":"noul","noul":<probability>};
// the weight equals answer.noul.
// Usage note: weighting requests batch 9 to 12 questions per HTTP call and the
// provider reports usage per call; each DecisionRecord's usage is that call's
// total divided evenly across the batch's questions (input per question 116 to
// 131, output 19), matching jev-log.json batch totals.

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
    probe_answer: string;
    endpoint_note?: string;
  };
}

export interface OutlineSubtopic {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
}

export interface OutlineAnswer {
  score: number;
  probabilities: Record<string, number>;
  confidence: number;
  legend: Record<string, string>;
}

export interface OutlineRecord {
  topic: string;
  ground_source: string;
  subtopics: OutlineSubtopic[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    endpoint: string;
    answers: Record<string, OutlineAnswer>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[];
    kept: string[];
    keep_note?: string;
  };
}

export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  answer: { type: string; noul?: number; score?: number; probabilities?: Record<string, number>; confidence?: number; legend?: Record<string, string> };
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
  kept: number;
}

export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: QueryAttempt[];
  redo_count: number;
  redo_log: Array<{ attempt: number; reason: string; new_queries: string[] }>;
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
  usage: { input_tokens: number; output_tokens: number };
  note?: string;
}
