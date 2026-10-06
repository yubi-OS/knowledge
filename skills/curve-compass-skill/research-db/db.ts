// research-db type map (schema v2)
// preflight.json -> PreflightRecord
// outline.json   -> OutlineRecord
// archive.json   -> DugResult[]
// digs/<NN>-<slug>.json -> DigRecord
// jev-log.json   -> JevLogEntry[]

export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string; unresponsive_engines?: string[] };
  decide: { url: string; model: string; probe_answer?: string; note?: string };
}

export interface OutlineSubtopic {
  nn: string;
  slug: string;
  scope: string;
  seed_queries: string[];
}

export interface ScoreAnswer {
  score: number;
  probabilities: Record<string, number>;
  confidence: number;
}

export interface Usage { input_tokens: number; output_tokens: number; cost?: number }

export interface OutlineRecord {
  topic: string;
  subtopics: OutlineSubtopic[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    attempts: { attempt: number; note: string; answers: Record<string, ScoreAnswer>; usage: Usage }[];
    dropped: string[];
    kept: string[];
    post_dig_drops: { nn: string; reason: string }[];
    final_authored: string[];
  };
}

export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: "clef";
  answer: Record<string, unknown>; // raw answer object, e.g. {"type":"noul","noul":0.43}
  usage: Partial<Usage>;
  requested_at: string;
}

export interface DugResult {
  query: string;
  subtopic?: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord | null;
  redo_of: number | null;   // index of superseded entry when rescored; null when the entry is original
  dup_of?: number;          // duplicate url of an earlier entry; weight copied from that entry
  redo_of_attempt?: number; // 2 when the entry came from a redo dig with different queries
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
  results_kept: string[]; // urls with weight >= 0.5
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
  usage: Partial<Usage>;
  note?: string;
}
