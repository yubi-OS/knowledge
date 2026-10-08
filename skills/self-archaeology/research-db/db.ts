// research-db type map:
//   preflight.json            -> PreflightRecord
//   outline.json              -> OutlineRecord
//   archive.json              -> DugResult[] (JSON array, one entry per collected result)
//   digs/<NN>-<slug>.json     -> DigRecord
//   jev-log.json              -> JevLogEntry[] (JSON array, one entry per jev HTTP request)

export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: string;
    unresponsive_engines?: string[];
  };
  decide: {
    url: string;
    model: string;
    probe_answer?: string;
    note?: string;
  };
}

export interface OutlineSubtopic {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
  web_shaped?: boolean;
  no_dig_reason?: string;
}

export interface OutlineValidation {
  metric: "score";
  criteria: string[];
  model: string;
  answers: Record<string, {
    score: number;
    probabilities?: Record<string, number>;
    confidence?: number;
    legend?: Record<string, string>;
  }>;
  usage: { input_tokens: number; output_tokens: number };
  dropped: string[];
  kept: string[];
}

export interface OutlineRecord {
  topic: string;
  subtopics: OutlineSubtopic[];
  validation: OutlineValidation;
}

// usage_scope documents that DefAPI returns usage per request, not per question;
// decision.usage holds the usage of the batch the question rode in.
export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  endpoint?: string;
  answer: unknown;
  usage: { input_tokens: number; output_tokens: number };
  usage_scope?: "batch";
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
  no_dig_reason?: string;
  pre_weight_filter?: { collected: number; weighted: number; note: string };
}

export interface JevLogEntry {
  requested_at: string | null;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens: number; output_tokens: number } | null;
  superseded?: boolean;
  note?: string;
}
