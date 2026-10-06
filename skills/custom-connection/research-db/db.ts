// research-db type map for skills/custom-connection
// File -> interface:
//   preflight.json -> PreflightRecord
//   outline.json   -> OutlineRecord
//   archive.json   -> DugResult[] (one entry per collected result)
//   digs/<NN>-<slug>.json -> DigRecord
//   jev-log.json   -> JevLogEntry[] (one entry per jev HTTP request)

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
  dig_type: "web-shaped" | "internal-record";
}

export interface OutlineRecord {
  topic: string;
  subtopics: OutlineSubtopic[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, { score: number; probabilities?: Record<string, number>; confidence?: number; legend?: Record<string, string> }>;
    usage?: { input_tokens: number; output_tokens: number };
    dropped: string[];
    kept: string[];
  };
}

export interface DecisionRecord {
  type: "noul";
  instructions: string;
  model: string;
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
  dig_type: "web-shaped" | "internal-record";
  queries_attempted: DigQueryAttempt[];
  redo_count: number;
  redo_log: Array<{ attempt: number; reason: string; new_queries?: string[] }>;
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
  usage?: { input_tokens: number; output_tokens: number };
}
