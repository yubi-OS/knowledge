// research-db/db.ts - interface map for the docs/todo research database.
// preflight.json -> PreflightRecord
// outline.json -> OutlineRecord
// archive.json -> DugResult[]
// digs/<NN>-<slug>.json -> DigRecord
// jev-log.json -> JevLogEntry[]

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string; unresponsive_engines?: string[] };
  decide: { url: string; model: string; probe_answer?: unknown; note?: string };
}

export interface OutlineSubtopic {
  nn: string; slug: string; scope: string; seed_queries: string[]; dig?: boolean;
}

export interface OutlineRecord {
  topic: string;
  ground_source?: string;
  subtopics: OutlineSubtopic[];
  validation: {
    metric: string;
    criteria: string[];
    model: string;
    answers: Record<string, { score: number; probabilities?: Record<string, number>; confidence: number; legend?: Record<string, string> }>;
    usage: { input_tokens?: number; output_tokens?: number };
    dropped: string[];
    kept: string[];
    drop_rule_note?: string;
  };
}

export interface DecisionRecord {
  type: string;
  instructions: string;
  model: string;
  answer: Record<string, unknown>;
  usage: { input_tokens: number | null; output_tokens: number | null };
  requested_at: string;
}

export interface DugResult {
  query: string;
  slug?: string;
  attempt?: number;
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
  kept: (string | null)[];
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
}

export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens?: number; output_tokens?: number };
}
