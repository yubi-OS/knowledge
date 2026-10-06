// research-db type definitions for skills/composefs-kernel-floors (yubi-OS/knowledge)
// File -> interface mapping:
//   preflight.json -> PreflightRecord
//   outline.json   -> OutlineRecord
//   archive.json   -> DugResult[] (one entry per collected dig result)
//   digs/<NN>-<slug>.json -> DigRecord
//   jev-log.json   -> JevLogEntry[]

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string; unresponsive_engines?: string[] };
  decide: { url: string; model: string; probe_answer?: string; note?: string };
}

export interface ScoreAnswer {
  score: number;
  probabilities: Record<string, number>;
  confidence: number;
  legend: Record<string, string>;
}

export interface OutlineRecord {
  topic: string;
  subtopics: { nn: string; slug: string; scope: string; seed_queries: string[] }[];
  validation: {
    metric: string;
    criteria: string[];
    model: string;
    endpoint_used?: string;
    provider?: string;
    answer_id?: string;
    task_id?: string;
    answers: Record<string, ScoreAnswer>;
    usage: { input_tokens: number; output_tokens: number; cost?: number };
    dropped: string[];
    kept: string[];
    notes?: string;
  };
}

export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  answer: { type: string; noul?: number; score?: number; probabilities?: Record<string, number> };
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
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
  notes?: string;
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
