// research-db type map for corpus attested-bootc-gpu-cutover
//
// File -> interface mapping:
//   preflight.json       -> PreflightRecord
//   outline.json         -> OutlineRecord
//   archive.json         -> DugResult[] (JSON array of DugResult)
//   digs/<NN>-<slug>.json -> DigRecord (one file per subtopic dig)
//   jev-log.json         -> JevLogEntry[] (JSON array, one per /api/decide HTTP request)

/** preflight.json — endpoint probes taken before the mint. */
export interface PreflightRecord {
  date: string;
  searxng: {
    url: string;
    probe_results: number;
    unresponsive_engines: string[];
  };
  decide: {
    url: string;
    model: string;
    probe_answer: unknown;
  };
}

/** outline.json — subtopic decomposition plus its jev score validation. */
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
      type: string;
      score: number;
      legend: Record<string, string>;
      probabilities: Record<string, number>;
      confidence: number;
    }>;
    usage: { input_tokens: number; output_tokens: number };
    dropped: string[];
    kept: string[];
  };
}

/** Raw jev answer object as returned by /api/decide (noul or score shape). */
export interface DecisionAnswer {
  type: string;
  noul?: number;
  score?: number;
  legend?: Record<string, string>;
  probabilities?: Record<string, number>;
  confidence?: number;
}

/** One collected searXNG result with its jev weighting decision. */
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

/** archive.json entry decision record. */
export interface DecisionRecord {
  type: "noul" | "score" | "choice";
  instructions: string;
  model: string;
  answer: DecisionAnswer;
  usage: { input_tokens: number | null; output_tokens: number | null };
  requested_at: string;
}

/** digs/<NN>-<slug>.json — per-subtopic dig record. */
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
  redo_log: Array<{ attempt: number; reason: string; new_queries: string[] }>;
  results_kept: string[];
  outcome: "authored" | "skipped";
  skip_reason?: string;
}

/** jev-log.json — one entry per /api/decide HTTP request. */
export interface JevLogEntry {
  requested_at: string;
  endpoint: string;
  state: string;
  model: string;
  n_questions: number;
  question_names: string[];
  metric_types: string[];
  usage: { input_tokens: number | null; output_tokens: number | null };
}
