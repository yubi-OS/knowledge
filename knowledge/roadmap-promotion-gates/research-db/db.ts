// research-db schema v2 for knowledge/roadmap-promotion-gates
// File -> interface mapping:
//   preflight.json            -> PreflightRecord
//   outline.json              -> OutlineRecord
//   archive.json (array)      -> DugResult[]
//   digs/<NN>-<slug>.json     -> DigRecord
//   jev-log.json (array)      -> JevLogEntry[]

export interface PreflightProbe {
  probe_query?: string;
  status?: number | string;
  results?: number;
  error?: string;
}

export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: PreflightProbe[];
    unresponsive_engines: string[];
  };
  decide: {
    url: string;
    model: string;
    probe_status?: number;
    probe_ok?: boolean;
    probe_answer: string | null;
  };
}

export interface OutlineSubtopic {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
}

export interface OutlineAnswer {
  score: number | null;
  probabilities: Record<string, number> | null;
  confidence: number | null;
  legend: Record<string, string> | null;
  raw?: string;
}

export interface OutlineRecord {
  topic: string;
  subtopics: OutlineSubtopic[];
  validation: {
    metric: string;
    criteria: string[];
    model: string;
    answers: Record<string, OutlineAnswer>;
    usage: unknown;
    dropped: string[];
    kept: string[];
  };
}

export interface DecisionRecord {
  type: string;
  instructions: string;
  model: string;
  answer: unknown; // raw answer object from /api/decide, e.g. { type: "noul", noul: 0.91 }
  usage: { input_tokens?: number; output_tokens?: number } | null;
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
  redo_of: number | null; // index of superseded entry when rescored
}

export interface QueryAttempt {
  query: string;
  attempt: number;
  raw_results: number;
  kept: number;
}

export interface RedoLogEntry {
  attempt: number;
  reason: string;
  new_queries: string[];
}

export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: QueryAttempt[];
  redo_count: number;
  redo_log: RedoLogEntry[];
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
  usage: { input_tokens?: number; output_tokens?: number } | null;
}
