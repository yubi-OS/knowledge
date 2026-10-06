// db.ts - interfaces for the skills/docker-setup-qemu-action research-db (schema v2)
// File -> interface map:
//   preflight.json          -> PreflightRecord
//   outline.json            -> OutlineRecord
//   archive.json            -> DugResult[] (array)
//   digs/<NN>-<slug>.json   -> DigRecord
//   jev-log.json            -> JevLogEntry[] (array)

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string; unresponsive_engines: string[] };
  decide: { url: string; model: string; probe_answer: string };
}

export interface OutlineSubtopic {
  nn: number;
  slug: string;
  scope: string;
  seed_queries: string[];
}

export interface OutlineRecord {
  topic: string;
  subtopics: OutlineSubtopic[];
  validation: {
    metric: string;
    criteria: string[];
    model: string;
    answers: Record<string, { score: number; probabilities: Record<string, number>; confidence: number }>;
    usage: { input_tokens: number; output_tokens: number; cost?: number };
    dropped: number[];
    kept: number[];
    notes?: string;
  };
}

export interface DecisionRecord {
  type: string; // "noul" | "score"
  instructions: string;
  model: string; // "clef (typesafe/jev-1.13 via DefAPI)"
  answer: unknown; // raw answer object from the decision model
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
  redo_of: string | null;
}

export interface QueryAttempt {
  query: string;
  attempt: number;
  raw_results: number;
  kept: number;
}

export interface DigRecord {
  nn: number;
  slug: string;
  scope: string;
  queries_attempted: QueryAttempt[];
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
  usage: { input_tokens: number; output_tokens: number };
}
