// research-db type map:
//   preflight.json -> PreflightRecord
//   outline.json   -> OutlineRecord
//   archive.json   -> DugResult[] (each carrying a DecisionRecord)
//   digs/<NN>-<slug>.json -> DigRecord
//   jev-log.json   -> JevLogEntry[]

export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: number;
    unresponsive_engines: unknown[];
    dig_probe_query?: string;
    dig_probe_results?: number;
    dig_probe_note?: string;
    probe_status?: number;
    healthy: boolean;
  };
  decide: {
    url: string;
    model: string | null;
    probe_answer: unknown;
    probe_status?: number;
    healthy: boolean;
  };
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
  legend: Record<string, string>;
}

export interface OutlineRecord {
  topic: string;
  source_file: string;
  subtopics: OutlineSubtopic[];
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, ScoreAnswer>;
    usage: { input_tokens: number; output_tokens: number };
    requested_at: string;
    dropped: string[];
    kept: string[];
  };
}

export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  answer: unknown; // raw answer object, e.g. { type: "noul", noul: 0.91 }
  usage: { input_tokens: number; output_tokens: number };
  requested_at: string;
}

export interface DugResult {
  query: string;
  nn: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord;
  redo_of: string | null;
}

export interface KeptResult {
  title: string;
  url: string;
  content: string;
}

export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: { query: string; attempt: number; raw_results: number; kept: KeptResult[] }[];
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
  usage: { input_tokens: number; output_tokens: number };
}
