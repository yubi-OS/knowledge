// research-db type map for knowledge/days-0-30-safe-offer
// File -> interface:
//   preflight.json                    -> PreflightRecord
//   outline.json                      -> OutlineRecord
//   archive.json (JSON array)         -> DugResult[]
//   digs/<NN>-<slug>.json             -> DigRecord
//   jev-log.json (JSON array)         -> JevLogEntry[]

/** preflight.json - environment probes taken before the mint */
export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: number;
    unresponsive_engines: string[];
  };
  decide: {
    url: string;
    model: string | null;
    probe_answer: unknown;
  };
}

/** outline.json - subtopic decomposition + jev score validation */
export interface OutlineRecord {
  topic: string;
  subtopics: Array<{
    nn: string;
    slug: string;
    scope: string;
    seed_queries: string[];
  }>;
  validation: {
    metric: "score";
    criteria: string[];
    model: string;
    answers: Record<string, {
      score: number | null;
      probabilities: Record<string, number> | null;
      confidence: number | null;
      legend: unknown;
    }>;
  } | null;
  usage: unknown;
  dropped: string[];
  kept: string[];
}

/** Raw answer object returned by the jev decision model for one question */
export interface DecisionAnswer {
  type?: string;
  score?: number;
  noul?: number;
  probabilities?: Record<string, number>;
  confidence?: number;
  legend?: unknown;
  [k: string]: unknown;
}

/** archive.json entry - one collected search result with its jev weighting */
export interface DugResult {
  query: string;
  title: string;
  url: string;
  snippet: string;
  collected_at: string;
  weight: number | null;
  decision: DecisionRecord | null;
  redo_of: number | null;
  /** extended fields: which subtopic doc the result feeds */
  nn: string;
  slug: string;
}

/** Full record of one jev /api/decide decision */
export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  answer: DecisionAnswer;
  usage: { input_tokens: number | null; output_tokens: number | null } | null;
  requested_at: string;
}

/** digs/<NN>-<slug>.json - the dig log for one subtopic */
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
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

/** jev-log.json entry - one HTTP request to the jev /api/decide endpoint */
export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens: number | null; output_tokens: number | null } | null;
}
