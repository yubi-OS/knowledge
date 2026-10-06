// research-db schema v2 for skills/dm-verity-and-integrity (yubi-OS/knowledge)
// File -> interface mapping:
//   preflight.json                  -> PreflightRecord
//   outline.json                    -> OutlineRecord
//   archive.json                    -> DugResult[] (one entry per collected result)
//   digs/<NN>-<slug>.json           -> DigRecord
//   jev-log.json                    -> JevLogEntry[]

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string; unresponsive_engines: string[] };
  decide: { url: string; model: string; note?: string; probe_answer?: unknown };
}

export interface OutlineSubtopic {
  nn: number;
  slug: string;
  scope: string;
  seed_queries: string[];
  dig_status?: string; // "internal-record subtopic, no dig" for subtopics skipped from searXNG
}

export interface OutlineRecord {
  topic: string;
  ground_source: string;
  subtopics: OutlineSubtopic[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, { score: number; probabilities?: Record<string, number>; confidence?: number; legend?: unknown }>;
    usage: { input_tokens?: number; output_tokens?: number };
    dropped: number[];
    kept: number[];
    note?: string;
  };
}

export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string; // "clef"
  answer: unknown; // raw answer object from the decision model
  usage: { input_tokens: number | null; output_tokens: number | null };
  requested_at: string;
}

export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null; // noul probability; null only if unscored
  decision: DecisionRecord;
  redo_of: number | null; // index of superseded unweighted entry
}

export interface DigRecord {
  nn: number;
  slug: string;
  scope: string;
  queries_attempted: { query: string; attempt: number; raw_results: number; kept: number }[];
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
  model: string | null;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens: number | null; output_tokens: number | null } | null;
  note?: string;
}
