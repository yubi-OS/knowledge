// research-db type map for the docker-metadata-action corpus
// preflight.json -> PreflightRecord
export interface PreflightRecord {
  date: string;
  searxng: { url: string; probe_results: string; unresponsive_engines?: string[] };
  decide: { url: string; model: string; probe_answer?: string | null; note?: string };
}

// outline.json -> OutlineRecord
export interface OutlineRecord {
  topic: string;
  ground_source: string;
  subtopics: { nn: string; slug: string; scope: string; seed_queries: string[]; internal_record?: boolean }[];
  validation: {
    metric: string;
    criteria: string[];
    model: string;
    answers: Record<string, { score: number; probabilities: Record<string, number>; confidence: number; legend: Record<string, string> }>;
    usage: unknown | null;
    dropped: string[];
    kept: string[];
    keep_note?: string;
  };
}

// archive.json (JSON array) -> DugResult[]
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

// decision block of an archive entry -> DecisionRecord
export interface DecisionRecord {
  type: string;
  instructions: string;
  model: string;
  answer: unknown;
  usage: { input_tokens: number; output_tokens: number } | null;
  requested_at: string;
}

// digs/<NN>-<slug>.json -> DigRecord
export interface DigRecord {
  nn: string;
  slug: string;
  scope: string;
  queries_attempted: { query: string; attempt: number; raw_results: number; kept: number }[];
  redo_count: number;
  redo_log: { attempt: number; reason: string; new_queries: string[] }[];
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
  note?: string;
}

// jev-log.json (JSON array) -> JevLogEntry[]
export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  provider?: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  http_status?: number;
  latency_ms?: number;
  usage: { input_tokens: number; output_tokens: number } | null;
}
