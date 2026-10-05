// research-db type map for knowledge/refederated-identity-oidc-sigstore-privacy
// File -> interface mapping:
//   research-db/preflight.json        -> PreflightRecord
//   research-db/outline.json          -> OutlineRecord (subtopics: OutlineSubtopic, validation: OutlineValidation)
//   research-db/archive.json          -> DugResult[] (each with a DecisionRecord)
//   research-db/jev-log.json          -> JevLogEntry[]
//   research-db/digs/<NN>-<slug>.json -> DigRecord

// maps to: research-db/preflight.json
export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: number;
    unresponsive_engines: string[] | unknown[];
  };
  decide: {
    url: string;
    model: string;
    probe_answer: unknown; // raw clef answer object (score-type) from the first successful /api/decide call
  };
}

// maps to: research-db/outline.json (per-subtopic entry)
export interface OutlineSubtopic {
  nn: string; // two-digit outline order, matches docs/<NN>-<slug>.md and digs/<NN>-<slug>.json
  slug: string;
  scope: string;
  seed_queries: string[];
}

// maps to: research-db/outline.json
export interface OutlineRecord {
  topic: string;
  subtopics: OutlineSubtopic[];
  validation: {
    metric: "score";
    criteria: string[]; // ["padding: drop", "marginal: keep only if the dig comes back strong", "load-bearing: core subtopic"]
    model: string;
    answers: Record<string, {
      score: number;
      probabilities: Record<string, number>;
      confidence: number;
      legend: Record<string, string>;
    }>;
    usage: { input_tokens: number; output_tokens: number } | null;
    dropped: string[]; // nn values scored 0
    kept: string[];
  };
}

// maps to: one entry of research-db/archive.json
export interface DugResult {
  nn: string;
  slug: string;
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string; // ISO 8601 UTC
  weight: number | null; // jev noul probability; null only if scoring failed after all redos
  decision: DecisionRecord | null;
  redo_of: number | null; // index of superseded unweighted entry when a result was rescored
}

// maps to: DugResult.decision
export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  answer: unknown; // raw answer object returned by /api/decide
  usage: {
    input_tokens: number | null;
    output_tokens: number | null;
  };
  requested_at: string; // ISO 8601 UTC
}

// maps to: research-db/digs/<NN>-<slug>.json
export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: Array<{
    query: string;
    attempt: number;
    raw_results: number;
    kept: number;
  }>;
  redo_count: number;
  redo_log: Array<{
    attempt: number;
    reason: string;
    new_queries: string[];
  }>;
  results_kept: string[]; // urls
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

// maps to: one entry of research-db/jev-log.json
export interface JevLogEntry {
  requested_at: string; // ISO 8601 UTC
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: {
    input_tokens: number | null;
    output_tokens: number | null;
  };
}
